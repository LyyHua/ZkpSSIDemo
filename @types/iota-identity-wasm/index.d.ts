declare module "@iota/identity-wasm" {
  export class Client {
    static fromConfig(config: Config): Client;
    publishDocument(document: Document): Promise<any>;
  }

  export class Config {
    static fromNetwork(network: string): Config;
  }

  export class Document {
    constructor(keyPair: KeyPair);
    id: string;
    insertMethod(method: VerificationMethod, type: string): void;
  }

  export class KeyPair {
    constructor();
  }

  export class VerificationMethod {
    static fromDID(did: string, keyPair: KeyPair, fragment: string): VerificationMethod;
  }
}
