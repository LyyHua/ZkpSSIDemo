import {
    IotaDocument,
    IotaDID,
    VerificationMethod,
    MethodData,
    MethodType,
    DIDUrl,
    MethodScope,
    CoreDID,
    // KeyPair and KeyType removed as they are not available here
} from "@iota/identity-wasm/node/identity_wasm"

import * as crypto from "crypto"

export async function initializeDID(): Promise<IotaDocument> {
    console.log("Attempting to initialize DID and Document...")

    const networkName = "smr" // Shimmer network (example)

    // Generate a new Ed25519 key pair using Node.js crypto
    const { publicKey: cryptoPublicKey } = crypto.generateKeyPairSync("ed25519")
    // Export the public key in SPKI DER format
    const spkiDer = cryptoPublicKey.export({ type: "spki", format: "der" })
    // For Ed25519, the raw public key is the last 32 bytes of the SPKI DER.
    const publicKeyBytes = new Uint8Array(spkiDer.slice(-32))
    console.log("Ed25519 public key bytes generated.")

    // Create a new DID with the public key bytes
    const did: IotaDID = new IotaDID(publicKeyBytes, networkName)
    console.log(`DID created: ${did.toString()}`)

    // Create a new IOTA Document with the DID
    let document: IotaDocument = IotaDocument.newWithId(did)
    console.log("IOTA Document created.")

    // Define properties for the new Verification Method
    const fragment = "key-1"
    const methodTypeInstance: MethodType =
        MethodType.Ed25519VerificationKey2018()
    // Create MethodData from the public key bytes
    const methodData: MethodData = MethodData.newBase58(publicKeyBytes)

    // Construct the full DID URL for the verification method
    const methodIdString = document.id().toString() + "#" + fragment
    const methodId: DIDUrl = DIDUrl.parse(methodIdString)

    // The controller of the verification method is the DID of the document itself.
    const controller: CoreDID = CoreDID.parse(document.id().toString())

    // Create a new Verification Method instance
    const verificationMethod: VerificationMethod = new VerificationMethod(
        methodId, // id: DIDUrl (full URL of the method)
        controller, // controller: CoreDID (DID of the document)
        methodTypeInstance, // type_: MethodType
        methodData // data: MethodData (public key material)
    )
    console.log("Verification method created.")

    // Insert the verification method into the document
    document.insertMethod(verificationMethod, MethodScope.Authentication())
    console.log("Verification method inserted into document.")

    console.log("DID and Document initialization complete.")
    console.log("Document JSON:", JSON.stringify(document.toJSON(), null, 2))
    return document
}

export async function publishDID(document: IotaDocument): Promise<void> {
    console.log("Publishing DID (mock implementation)...", document.toJSON())
    console.log("DID Document published (mocked).\n")
}

/**
 * Simulates a Zero-Knowledge Proof operation (placeholder).
 * @param document The IOTA Document containing the DID information.
 */
export async function simulateZKP(document?: IotaDocument) {
    if (!document) {
        console.log(
            "Document not provided, initializing new one for ZKP simulation."
        )
        document = await initializeDID()
    }
    console.log("Simulating ZKP with document:", document.id().toString())
    // Placeholder for actual ZKP logic
    // This might involve using the verification methods, signing/verifying challenges, etc.
    console.log("ZKP simulation placeholder complete.")
}

// Removed direct call to simulateZKP() to avoid double execution
// simulateZKP().catch(error => {
//     console.error("Unhandled error in ZKP simulation:", error);
// });
