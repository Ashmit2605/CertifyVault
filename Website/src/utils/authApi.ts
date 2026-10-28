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

export type AdminAccount = Pick<
  UserProfile,
  | "id"
  | "clerkId"
  | "email"
  | "firstName"
  | "lastName"
  | "institutionName"
  | "isActive"
  | "createdAt"
> & {
  role: "issuer" | "verifier";
};

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

function parseAdminAccount(account: unknown): AdminAccount {
  if (
    typeof account !== "object" ||
    account === null ||
    !("id" in account) ||
    typeof account.id !== "number" ||
    !("clerkId" in account) ||
    typeof account.clerkId !== "string" ||
    !("email" in account) ||
    typeof account.email !== "string" ||
    !("firstName" in account) ||
    typeof account.firstName !== "string" ||
    !("lastName" in account) ||
    typeof account.lastName !== "string" ||
    !("role" in account) ||
    (account.role !== "issuer" && account.role !== "verifier") ||
    !("institutionName" in account) ||
    !(typeof account.institutionName === "string" || account.institutionName === null) ||
    !("isActive" in account) ||
    typeof account.isActive !== "boolean" ||
    !("createdAt" in account) ||
    typeof account.createdAt !== "string"
  ) {
    throw new Error("The account service returned an invalid account.");
  }

  return {
    id: account.id,
    clerkId: account.clerkId,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    role: account.role,
    institutionName: account.institutionName,
    isActive: account.isActive,
    createdAt: account.createdAt,
  };
}

export async function getAdminAccounts(
  token: string,
  role: AdminAccount["role"],
): Promise<AdminAccount[]> {
  const response = await authRequest(`/admin/accounts?role=${role}`, token);
  if (typeof response !== "object" || response === null || !("data" in response)) {
    throw new Error("The account service returned an invalid account list.");
  }

  const { data } = response;
  if (
    typeof data !== "object" ||
    data === null ||
    !("accounts" in data) ||
    !Array.isArray(data.accounts)
  ) {
    throw new Error("The account service returned an invalid account list.");
  }

  return data.accounts.map(parseAdminAccount);
}

export async function setAccountActivation(
  token: string,
  clerkId: string,
  isActive: boolean,
): Promise<AdminAccount> {
  const response = await authRequest(
    `/users/${encodeURIComponent(clerkId)}/activation`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    },
  );
  if (typeof response !== "object" || response === null || !("data" in response)) {
    throw new Error("The account service returned an invalid activation response.");
  }

  const { data } = response;
  if (typeof data !== "object" || data === null || !("user" in data)) {
    throw new Error("The account service returned an invalid activation response.");
  }

  return parseAdminAccount(data.user);
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
