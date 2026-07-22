'use client';

import { useMemo, useState } from 'react';
import OpportunityModal from '@/components/OpportunityModal';
import { createClient } from '@/utils/supabase/client';
import { readProfile } from '@/utils/profile';

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

export default function InternalOpportunitiesClient({ opportunities }: InternalOpportunitiesClientProps) {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [signupState, setSignupState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [signupMessage, setSignupMessage] = useState('');
  const supabase = useMemo(() => createClient(), []);

  const handleSignup = async (opportunity: Opportunity) => {
    setSignupState('submitting');
    setSignupMessage('');

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id ?? null;

    if (!userId) {
      setSignupState('idle');
      setSignupMessage('Please sign in before signing up for an opportunity.');
      return;
    }

    const profile = await readProfile(supabase, userId);

    const payload = {
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
      user_id: userId,
      name: profile.name || 'Unknown',
      email: profile.email || '',
      contact_number: profile.contactNumber || '',
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
        lastError?.message?.includes('Could not find the table')
          ? 'Signup could not be saved because the signup table is not available in your Supabase project.'
          : lastError?.message ?? 'Unable to save your signup right now.'
      );
      return;
    }

    setSignupState('success');
    setSignupMessage(`Your signup request for ${opportunity.title} was sent.`);
  };

  return (
    <>
      <div className="pt-32 pb-32">
        <div className="px-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-left">Internal Opportunities</h1>
          <p className="text-lg text-gray-700 text-left mt-1">
            Sign up for opportunities posted by student groups within RI!
          </p>
        </div>

        <div className="px-10 max-w-7xl mx-auto mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opp) => (
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
                {opp.deadline && (
                  <span className="text-xs text-gray-500">Due {opp.deadline}</span>
                )}
              </div>

              <h2 className="mt-4 font-semibold text-lg">{opp.title}</h2>
              <p className="mt-2 text-sm text-gray-600 line-clamp-4">{opp.description}</p>
            </button>
          ))}
        </div>


        {signupMessage ? (
          <div className="px-10 max-w-7xl mx-auto mt-4">
            <p className={`text-sm ${signupState === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {signupMessage}
            </p>
          </div>
        ) : null}
        
      </div>

      <OpportunityModal
        opportunity={selected}
        onClose={() => setSelected(null)}
        onPrimaryAction={(opportunity) => {
          setSelected(null);
          handleSignup(opportunity);
        }}
      />
    </>
  );
}
