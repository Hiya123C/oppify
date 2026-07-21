export type ProfileData = {
  name: string;
  email: string;
  contactNumber: string;
};

const PROFILE_STORAGE_KEY = "oppify-profile";

export function getDefaultProfile(): ProfileData {
  return {
    name: "",
    email: "",
    contactNumber: "",
  };
}

export function readProfile(): ProfileData {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return getDefaultProfile();

    const parsed = JSON.parse(raw) as Partial<ProfileData>;
    return {
      ...getDefaultProfile(),
      ...parsed,
    };
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile: ProfileData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
