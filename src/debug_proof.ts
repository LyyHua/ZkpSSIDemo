// This script inspects the Proof class specifically
import path from "path"

async function inspectProofClass() {
    try {
        // Try to resolve the module path
        const modulePath = require.resolve(
            "@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Resolved module path:", modulePath)

        // Dynamic import using the resolved path
        const identityWasm = await import(modulePath)
        console.log("Successfully imported @iota/identity-wasm")

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
            console.log("WASM module initialized successfully")
        }

        // Focus on the Proof class
        const { Proof } = identityWasm

        if (Proof) {
            console.log("\nProof class details:")
            console.log(`- typeof Proof: ${typeof Proof}`)
            console.log(
                `- Proof constructor: ${Proof.toString().slice(0, 200)}...`
            )

            // Inspect prototype methods
            const proto = Proof.prototype
            if (proto) {
                const methods = Object.getOwnPropertyNames(proto).filter(
                    (name) => name !== "constructor"
                )
                if (methods.length > 0) {
                    console.log(`- Methods: ${methods.join(", ")}`)
                }
            }

            // Try to create a simple Proof instance
            try {
                console.log("\nAttempting to create a Proof instance:")

                // Try different constructor approaches
                const proof1 = new Proof({
                    type: "Ed25519Signature2018",
                    created: new Date().toISOString(),
                    proofPurpose: "assertionMethod",
                    verificationMethod: "did:iota:1234#key-1",
                    jws: "eyJhbGciOiJFZERTQSJ9..signature",
                })

                console.log(
                    "Successfully created Proof instance with object argument"
                )
                console.log(
                    `- Proof instance properties: ${Object.keys(proof1).join(
                        ", "
                    )}`
                )
                console.log(`- Proof instance type: ${proof1.type}`)
            } catch (error: any) {
                console.error(`Error creating Proof instance: ${error.message}`)

                // Try alternative approach
                try {
                    console.log("\nTrying alternative Proof construction:")
                    const proof2 = new Proof()
                    // Try setting properties
                    if (typeof proof2.type === "function") {
                        proof2.type("Ed25519Signature2018")
                    }
                    console.log("Created empty Proof and set properties")
                } catch (e: any) {
                    console.error(
                        `Alternative approach also failed: ${e.message}`
                    )
                }
            }
        } else {
            console.log("Proof class not found in identityWasm module")
        }
    } catch (error) {
        console.error("Error inspecting Proof class:", error)
    }
}

inspectProofClass()
