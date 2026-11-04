declare module "@digitalbazaar/ed25519-multikey" {
  export interface Ed25519MultikeyInstance {
    signer(): {
      id: string;
      sign(input: { data: Uint8Array }): Promise<Uint8Array>;
    };
    export(options: {
      publicKey?: boolean;
      secretKey?: boolean;
      includeContext?: boolean;
    }): Promise<{
      id?: string;
      controller?: string;
      publicKeyMultibase?: string;
      secretKeyMultibase?: string;
    }>;
  }

  export function from(input: {
    "@context"?: string;
    type?: "Multikey";
    id?: string;
    controller?: string;
    publicKeyMultibase: string;
    secretKeyMultibase?: string;
  }): Promise<Ed25519MultikeyInstance>;

  export function generate(options?: {
    id?: string;
    controller?: string;
  }): Promise<Ed25519MultikeyInstance>;
}

declare module "@digitalbazaar/multikey-context" {
  const context: {
    CONTEXT_URL: string;
    CONTEXT: Record<string, unknown>;
    contexts: Map<string, unknown>;
  };
  export default context;
}

declare module "@digitalbazaar/credentials-context" {
  export const contexts: Map<string, unknown>;
}

declare module "@digitalbazaar/security-context" {
  const context: {
    contexts: Map<string, unknown>;
  };
  export default context;
}

declare module "@digitalbazaar/data-integrity" {
  export class DataIntegrityProof {
    constructor(options: {
      signer?: {
        id: string;
        sign(input: { data: Uint8Array }): Promise<Uint8Array>;
      };
      cryptosuite: Record<string, unknown>;
    });
  }
}

declare module "@digitalbazaar/eddsa-rdfc-2022-cryptosuite" {
  export const cryptosuite: Record<string, unknown>;
}

declare module "@digitalbazaar/did-method-key" {
  export function driver(): {
    use(options: {
      multibaseMultikeyHeader: string;
      fromMultibase: (input: { publicKeyMultibase: string }) => Promise<unknown>;
    }): void;
    get(options: { did: string }): Promise<unknown>;
  };
}

declare module "@digitalbazaar/vc" {
  export function verifyCredential(options: {
    credential: Record<string, unknown>;
    suite: import("@digitalbazaar/data-integrity").DataIntegrityProof;
    documentLoader: (url: string) => Promise<{
      contextUrl: null;
      documentUrl: string;
      document: unknown;
    }>;
  }): Promise<{ verified: boolean }>;
}

declare module "jsonld-signatures" {
  const jsonldSignatures: {
    purposes: {
      AssertionProofPurpose: new () => unknown;
    };
    sign(
      document: Record<string, unknown>,
      options: {
        suite: import("@digitalbazaar/data-integrity").DataIntegrityProof;
        purpose: unknown;
        documentLoader: (url: string) => Promise<{
          contextUrl: null;
          documentUrl: string;
          document: unknown;
        }>;
      },
    ): Promise<unknown>;
  };
  export default jsonldSignatures;
}
