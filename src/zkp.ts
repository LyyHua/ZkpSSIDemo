import path from "path"

// Resolve the module path dynamically based on environment
function getIdentityWasmPath() {
    try {
        // Try to resolve the module path
        const modulePath = require.resolve(
            "@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Resolved module path:", modulePath)
        return modulePath
    } catch (error) {
        console.error("Error resolving @iota/identity-wasm:", error)
        // Fallback to a direct path (adjust if needed)
        const fallbackPath = path.resolve(
            __dirname,
            "../node_modules/@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Using fallback path:", fallbackPath)
        return fallbackPath
    }
}

async function importIdentityWasm() {
    try {
        // Get the resolved path
        const modulePath = require.resolve(
            "@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Resolved module path:", modulePath)

        // Dynamic import using the resolved path
        const identityWasm = await import(modulePath)
        console.log("Successfully imported @iota/identity-wasm")
        return identityWasm
    } catch (error) {
        console.error("Failed to import @iota/identity-wasm:", error)
        throw error
    }
}

export async function simulateZKP() {
    try {
        // Dynamically import the WASM module
        const identityWasm = await importIdentityWasm()

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
            console.log("WASM module initialized successfully")
        }

        // Create timestamp function
        const now = () => new Date().toISOString()

        // Create a credential without using setProof directly
        const { Credential, Presentation } = identityWasm

        // Step 1: Create a sample Credential with properties including proof
        const credential = new Credential({
            id: "https://example.com/credentials/123",
            type: ["VerifiableCredential"],
            issuer: "did:iota:1234",
            credentialSubject: {
                id: "did:iota:5678",
                name: "John Doe",
                age: 42,
            },
            issuanceDate: now(),
            // Include the proof in the initial constructor instead of using setProof
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            proof: {
                type: "Ed25519Signature2018",
                created: now(),
                proofPurpose: "assertionMethod",
                verificationMethod: "did:iota:1234#key-1",
                jws: "eyJhbGciOiJFZERTQSJ9..signature",
            },
        })

        // Step 2: Create a Presentation with the credential
        const presentationObj = {
            id: "https://example.com/presentations/123",
            type: ["VerifiablePresentation"],
            holder: "did:iota:5678",
            verifiableCredential: [credential],
            // Include the proof in the initial constructor
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            proof: {
                type: "Ed25519Signature2018",
                created: now(),
                proofPurpose: "authentication",
                verificationMethod: "did:iota:5678#key-1",
                jws: "eyJhbGciOiJFZERTQSJ9..signature",
            },
        }

        const presentation = new Presentation(presentationObj)

        // Output the simulated ZKP presentation
        console.log("ZKP Simulation Result:")
        console.log(JSON.stringify(presentation, null, 2))

        return presentation
    } catch (error: any) {
        console.error("Error in simulateZKP:", error)
        throw error
    }
}
