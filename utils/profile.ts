import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileData = {
  name: string;
  email: string;
  contactNumber: string;
};

export function getDefaultProfile(): ProfileData {
  return {
    name: "",
    email: "",
    contactNumber: "",
  };
}

export async function readProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileData> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email, contact_number")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return getDefaultProfile();
  }

  return {
    name: data.name ?? "",
    email: data.email ?? "",
    contactNumber: data.contact_number ?? "",
  };
}

export async function saveProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: ProfileData
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      name: profile.name,
      email: profile.email,
      contact_number: profile.contactNumber,
    })
    .eq("id", userId);

  return { error };
}