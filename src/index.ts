import { start } from "@iota/identity-wasm/node/identity_wasm"
import { initializeDID, publishDID, simulateZKP } from "./zkp"

async function main() {
    try {
        start() // Initialize the WASM module
        console.log("IOTA Identity WASM module initialized successfully.")

        const document = await initializeDID() // Correctly assign the returned IotaDocument
        if (document) {
            console.log("DID Initialized:", document.id().toString())
            // If you need to pass the document to publishDID or simulateZKP, do it here
            // await publishDID(document); // Example if you want to publish
        } else {
            console.error("Failed to initialize DID.")
            process.exit(1) // Exit if DID initialization fails
        }

        await simulateZKP(document) // Pass the initialized document to simulateZKP
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
