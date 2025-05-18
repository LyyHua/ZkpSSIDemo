/**
 * Utility functions for IOTA Identity examples
 */
import {
    IotaDocument,
    IotaIdentityClient,
    JwkMemStore,
    KeyIdMemStore,
    MethodScope,
    Storage,
} from "@iota/identity-wasm/node"
import { ClientConfig } from "@iota/iota-sdk"

/** Creates a new DID with a new Ed25519 verification method. */
export async function createDid(
    client: IotaIdentityClient,
    storage: Storage
): Promise<IotaDocument> {
    // Create a new DID Document with a new Ed25519 verification method.
    const document = new IotaDocument()

    // Create a key pair for the DID.
    const key = await storage.generateEd25519Key()

    // Add a new verification method to the DID Document.
    document.insertMethod({
        content: {
            type: "Ed25519VerificationKey2018",
            publicKeyMultibase: key.public,
        },
        id: "key-1",
        scope: MethodScope.VerificationMethod,
    })

    // Add authentication control for the created method.
    document.attachMethodRelationship({
        methodId: document.id().toString() + "#key-1",
        relationship: "authentication",
    })

    // Add capability delegation control for the created method.
    document.attachMethodRelationship({
        methodId: document.id().toString() + "#key-1",
        relationship: "capabilityDelegation",
    })

    // Add assertion method control for the created method.
    document.attachMethodRelationship({
        methodId: document.id().toString() + "#key-1",
        relationship: "assertionMethod",
    })

    // Publish the DID Document to the Tangle.
    await client.publishDocument(document)

    return document
}

/** Creates a Memory Storage instance. */
export function createStorage(): Storage {
    return new Storage(new JwkMemStore(), new KeyIdMemStore())
}

/** Creates a client configuration with sensible default values for demonstration purposes. */
export async function createClientConfig(): Promise<ClientConfig> {
    // Choose the Testnet node API as a Shimmer node endpoint.
    const nodes = [{ url: "https://api.testnet.shimmer.network" }]

    return {
        nodes,
    }
}

/** Creates an identity client with default configuration. */
export async function createIdentityClient(): Promise<IotaIdentityClient> {
    const config = await createClientConfig()

    // In newer versions of the API, create client a bit differently
    const client = new IotaIdentityClient({
        clientConfig: config,
    })

    return client
}

/** Resolve an identity by its DID. */
export async function resolveDocument(
    client: IotaIdentityClient,
    did: string
): Promise<IotaDocument> {
    return client.resolveDid(did)
}
