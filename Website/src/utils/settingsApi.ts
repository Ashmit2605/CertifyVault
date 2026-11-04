export interface AdminSettingsProfile {
  fullName: string;
  email: string;
  role: string;
  avatarData: string | null;
  twoFactorEnabled: boolean;
}

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function settingsRequest(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<unknown> {
  const response = await fetch(`${apiBaseUrl}/settings${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof Blob
        ? { "Content-Type": options.body.type }
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Unable to update account settings.";
    throw new Error(message);
  }
  return body;
}

function parseProfile(response: unknown): AdminSettingsProfile {
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response) ||
    typeof response.data !== "object" ||
    response.data === null ||
    !("profile" in response.data)
  ) {
    throw new Error("The settings service returned an invalid profile.");
  }

  const profile = response.data.profile;
  if (
    typeof profile !== "object" ||
    profile === null ||
    !("fullName" in profile) ||
    typeof profile.fullName !== "string" ||
    !("email" in profile) ||
    typeof profile.email !== "string" ||
    !("role" in profile) ||
    typeof profile.role !== "string" ||
    !("avatarData" in profile) ||
    !(typeof profile.avatarData === "string" || profile.avatarData === null) ||
    !("twoFactorEnabled" in profile) ||
    typeof profile.twoFactorEnabled !== "boolean"
  ) {
    throw new Error("The settings service returned an invalid profile.");
  }

  return {
    fullName: profile.fullName,
    email: profile.email,
    role: profile.role,
    avatarData: profile.avatarData,
    twoFactorEnabled: profile.twoFactorEnabled,
  };
}

export async function getAdminSettings(
  token: string,
): Promise<AdminSettingsProfile> {
  return parseProfile(await settingsRequest("/", token));
}

export async function updateAdminProfile(
  token: string,
  fullName: string,
): Promise<AdminSettingsProfile> {
  return parseProfile(
    await settingsRequest("/profile", token, {
      method: "PATCH",
      body: JSON.stringify({ fullName }),
    }),
  );
}

export async function uploadAdminAvatar(
  token: string,
  image: File,
): Promise<string> {
  const response = await settingsRequest("/avatar", token, {
    method: "PUT",
    body: image,
  });
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response) ||
    typeof response.data !== "object" ||
    response.data === null ||
    !("avatarData" in response.data) ||
    typeof response.data.avatarData !== "string"
  ) {
    throw new Error("The settings service returned an invalid image response.");
  }
  return response.data.avatarData;
}

export async function removeAdminAvatar(token: string): Promise<void> {
  await settingsRequest("/avatar", token, { method: "DELETE" });
}

export async function revokeAdminSessions(token: string): Promise<void> {
  await settingsRequest("/sessions/revoke-all", token, { method: "POST" });
}
