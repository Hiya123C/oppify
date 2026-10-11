'use client';

import { useEffect, useMemo, useState } from 'react';
import OpportunityModal from '@/components/OpportunityModal';
import { createClient } from '@/utils/supabase/client';
import { getDefaultProfile, readProfile } from '@/utils/profile';

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  link?: string;
  requirements?: string[];
};

type InternalOpportunitiesClientProps = {
  opportunities: Opportunity[];
};

const signupTableCandidates = ["volunteer_signups"];

function isMissingTableError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() ?? "";
  return message.includes("could not find the table") || message.includes("schema cache") || message.includes("relation") || message.includes("does not exist");
}

const isCommunityEducation = (o: Opportunity) =>
  o.category?.toUpperCase().startsWith("CE") ?? false;

export default function InternalOpportunitiesClient({ opportunities }: InternalOpportunitiesClientProps) {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [signupState, setSignupState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [signupMessage, setSignupMessage] = useState('');
  const [currentProfile, setCurrentProfile] = useState(getDefaultProfile);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // keep profiles.email in sync with the authenticated email, always
      await supabase.from("profiles").upsert({ id: user.id, email: user.email });

      const profile = await readProfile(supabase, user.id);
      if (isActive) setCurrentProfile(profile);
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  const handleSignup = async (opportunity: Opportunity, contactInfo: { name: string; email: string; contactNumber: string }) => {
    setSignupState('submitting');
    setSignupMessage('');

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id ?? null;

    if (!userId) {
      setSignupState('idle');
      setSignupMessage('Please sign in before signing up for an opportunity.');
      return;
    }

    // const profile = await readProfile(supabase, userId);

    const payload = {
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
      user_id: userId,
      name: contactInfo.name || 'Unknown',
      email: contactInfo.email || '',
      contact_number: contactInfo.contactNumber || '',
      status: 'pending',
    };

    let lastError: { message?: string } | null = null;
    let didSucceed = false;

    for (const tableName of signupTableCandidates) {
      const { error } = await supabase.from(tableName).insert(payload);

      if (!error) {
        didSucceed = true;
        break;
      }

      lastError = error;
      if (!isMissingTableError(error)) {
        break;
      }
    }

    if (!didSucceed) {
      setSignupState('idle');
      setSignupMessage(
        lastError?.message?.includes('duplicate key')
          ? "You've already signed up for this one!"
          : lastError?.message ?? 'Unable to save your signup right now.'
      );
      return;
    }

    setSignupState('success');
    setSignupMessage(`Your signup request for ${opportunity.title} was sent.`);
  };


  const communityEducation = opportunities.filter(isCommunityEducation);
  const miscellaneous = opportunities.filter((o) => !isCommunityEducation(o));

  const renderCard = (opp: Opportunity) => (
    <button
      key={opp.id}
      type="button"
      onClick={() => setSelected(opp)}
      className="cards rounded-2xl p-6 shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        {opp.category && (
          <span className="inline-block text-xs font-medium text-gray-600 bg-white/60 border border-gray-300 rounded-full px-3 py-1">
            {opp.category}
          </span>
        )}
        {opp.deadline && <span className="text-xs text-gray-500">Due {opp.deadline}</span>}
      </div>
      <h2 className="mt-4 font-semibold text-lg">{opp.title}</h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-4">{opp.description}</p>
    </button>
  );

  const gridClass = "grid gap-6 md:grid-cols-2 xl:grid-cols-3";

  return (
    <>
      <div className="pt-32 pb-32">
        <div className="px-6 sm:px-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-left">Internal Opportunities</h1>
          <p className="text-lg text-gray-700 text-left mt-1">
            Opportunities posted by student groups within RI!
          </p>
        </div>

        <section className="px-6 sm:px-10 max-w-7xl mx-auto mt-12">
          <h3 className="text-3xl font-bold">Community Education Opportunities</h3>
          <p className="text-sm text-gray-600 mt-1 mb-6">Sign-up required</p>
          {communityEducation.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing open right now</p>
          ) : (
            <div className={gridClass}>{communityEducation.map(renderCard)}</div>
          )}
        </section>

        {signupMessage ? (
          <div className="px-6 sm:px-10 max-w-7xl mx-auto mt-4">
            <p className={`text-sm ${signupState === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {signupMessage}
            </p>
          </div>
        ) : null}

        <section className="px-6 sm:px-10 max-w-7xl mx-auto mt-16">
          <h3 className="text-3xl font-bold">Miscellaneous</h3>
          <p className="text-sm text-gray-600 mt-1 mb-6">Surveys, performances and announcements, no sign up required!</p>
          {miscellaneous.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing here yet</p>
          ) : (
            <div className={gridClass}>{miscellaneous.map(renderCard)}</div>
          )}
        </section>
      </div>

      <OpportunityModal
        opportunity={selected}
        onClose={() => setSelected(null)}
        onPrimaryAction={
          selected && isCommunityEducation(selected)
            ? (opportunity, contactInfo) => {
                setSelected(null);
                handleSignup(opportunity, contactInfo);
              }
            : undefined
        }
        defaultName={currentProfile.name}
        defaultEmail={currentProfile.email}
        defaultContactNumber={currentProfile.contactNumber}
        contactPersonName="the project lead who posted this"
      />
    </>
  );
}
