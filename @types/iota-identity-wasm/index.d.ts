declare module "@iota/identity-wasm" {
    export class Credential {
        constructor(data: any)
    }

    export class VerifiableCredential {
        constructor(credential: Credential, options: any)
    }

    export class Presentation {
        constructor(data: any)
    }

    export class VerifiablePresentation {
        constructor(presentation: Presentation, options: any)
    }

    export class ProofOptions {}

    export class Resolver {}

    export class Timestamp {
        static now(): Timestamp
        // If you know other static or instance methods, they can be added here.
        // For example, if Timestamp can be constructed from a string:
        // constructor(rfc3339: string);
        // toRFC3339(): string;
    }

    export function start(): void
}
