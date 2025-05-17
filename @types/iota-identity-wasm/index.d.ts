declare module "@iota/identity-wasm" {
    // Core W3C Credential Classes
    export class Credential {
        constructor(data: any);
        toJSON(): any;
        id: string;
        type: string[];
        issuer: string;
        credentialSubject: any;
        issuanceDate: string;
        expirationDate: string;
        proof: any;
    }

    export class VerifiableCredential {
        constructor(credential: Credential, options: any);
        toJSON(): any;
        verify(options?: any): Promise<VerificationResult>;
    }

    export class Presentation {
        constructor(data: any);
        toJSON(): any;
        id: string;
        type: string[];
        verifiableCredential: VerifiableCredential[];
        holder: string;
    }

    export class VerifiablePresentation {
        constructor(presentation: Presentation, options: any);
        toJSON(): any;
        verify(options?: any): Promise<VerificationResult>;
    }

    // ZKP Selective Disclosure Classes
    export class SelectiveDisclosurePresentation {
        constructor(options?: any);
        concealInSubject(attributeName: string): void;
        createPresentationJpt(options: any): any;
        toJSON(): any;
    }

    export class JptCredentialValidator {
        constructor(resolver: Resolver);
        verify(options: any): Promise<VerificationResult>;
    }

    export class JptPresentationValidator {
        constructor(resolver: Resolver);
        verify(options: any): Promise<VerificationResult>;
    }

    // Support Classes
    export class ProofOptions {
        constructor(options?: any);
        purpose: string;
        verificationMethod: string;
        challenge?: string;
        domain?: string;
    }

    export class Resolver {
        constructor(options?: any);
        resolve(did: string): Promise<any>;
    }

    export class Timestamp {
        static now(): Timestamp;
        toRFC3339(): string;
    }

    export interface VerificationResult {
        verified: boolean;
        error?: string;
    }

    // WASM Initialization
    export function start(): void;
}
