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
    .upsert({
      id: userId,
      name: profile.name,
      email: profile.email,
      contact_number: profile.contactNumber,
    });

  return { error };
}

export function cleanLocalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (value.trim().startsWith("+65")) digits = digits.slice(2);
  else if (digits.length === 10 && digits.startsWith("65")) digits = digits.slice(2);
  return digits.slice(0, 8);
}

export function storedToLocal(stored: string) {
  return stored.startsWith("+65") ? stored.slice(3) : stored.replace(/\D/g, "").slice(0, 8);
}