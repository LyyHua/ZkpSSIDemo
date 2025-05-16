import { start } from "@iota/identity-wasm/node/identity_wasm"
import { initializeDID, simulateZKP } from "./zkp" // Removed publishDID as it's not used

async function main() {
    try {
        start() // Initialize the WASM module
        console.log("IOTA Identity WASM module initialized successfully.")

        // You can still initialize a separate DID here if needed for other purposes
        // or for observing its structure, but it's not directly used by the self-contained simulateZKP.
        const mainDocument = await initializeDID()
        if (mainDocument) {
            console.log(
                "Main DID Initialized (from index.ts):",
                mainDocument.id().toString()
            )
        } else {
            console.error("Failed to initialize main DID (from index.ts).")
            // process.exit(1); // Decide if this failure should stop the whole process
        }

        // simulateZKP is now self-contained and will create its own issuer DID etc.
        await simulateZKP()
    } catch (error) {
        console.error(
            "Error during application initialization or ZKP simulation:",
            error
        )
        if (error instanceof Error && error.stack) {
            console.error("Stack trace:", error.stack)
        }
        process.exit(1)
    }
}

main()
