export type AccountRole = "issuer" | "holder" | "verifier";

export interface UserProfile {
  id: number;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AccountRole | "admin";
  institutionName: string | null;
  isActive: boolean;
  createdAt: string;
}

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function authRequest(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<unknown> {
  const response = await fetch(`${apiBaseUrl}/auth${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
        : "Unable to connect to the account service.";
    throw new Error(message);
  }

  return body;
}

function parseUserProfile(response: unknown): UserProfile {
  if (typeof response !== "object" || response === null || !("data" in response)) {
    throw new Error("The account service returned an invalid response.");
  }

  const { data } = response;
  if (typeof data !== "object" || data === null || !("user" in data)) {
    throw new Error("The account service returned an invalid user profile.");
  }

  const user = data.user;
  if (
    typeof user !== "object" ||
    user === null ||
    !("id" in user) ||
    typeof user.id !== "number" ||
    !("clerkId" in user) ||
    typeof user.clerkId !== "string" ||
    !("email" in user) ||
    typeof user.email !== "string" ||
    !("firstName" in user) ||
    typeof user.firstName !== "string" ||
    !("lastName" in user) ||
    typeof user.lastName !== "string" ||
    !("role" in user) ||
    !["issuer", "holder", "verifier", "admin"].includes(String(user.role)) ||
    !("institutionName" in user) ||
    !(typeof user.institutionName === "string" || user.institutionName === null) ||
    !("isActive" in user) ||
    typeof user.isActive !== "boolean" ||
    !("createdAt" in user) ||
    typeof user.createdAt !== "string"
  ) {
    throw new Error("The account service returned an invalid user profile.");
  }

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as UserProfile["role"],
    institutionName: user.institutionName,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function registerUser(
  token: string,
  role: AccountRole,
  institutionName?: string,
): Promise<UserProfile> {
  const response = await authRequest(
    "/register",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        role,
        ...(institutionName ? { institutionName } : {}),
      }),
    },
  );
  return parseUserProfile(response);
}

export async function getCurrentUser(token: string): Promise<UserProfile> {
  return parseUserProfile(await authRequest("/me", token));
}

export function dashboardForRole(role: UserProfile["role"]): string {
  switch (role) {
    case "issuer":
      return "/issuerdashboard";
    case "verifier":
      return "/verifierdashboard";
    case "admin":
      return "/admindashboard";
    case "holder":
      return "/holderdashboard";
  }
}
