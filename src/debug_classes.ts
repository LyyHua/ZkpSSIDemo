// This script inspects the available classes and methods in the @iota/identity-wasm module
import path from "path"

async function inspectModule() {
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

        // Print available exports
        console.log("\nAvailable exports:")
        Object.keys(identityWasm).forEach((key) => {
            const type = typeof identityWasm[key]
            console.log(`- ${key}: ${type}`)

            // If it's a constructor function (class), log more details
            if (type === "function" && /^[A-Z]/.test(key)) {
                try {
                    console.log(
                        `  Constructor: ${identityWasm[key]
                            .toString()
                            .slice(0, 100)}...`
                    )

                    // Try to see if prototype methods exist
                    const proto = identityWasm[key].prototype
                    if (proto) {
                        const methods = Object.getOwnPropertyNames(
                            proto
                        ).filter((name) => name !== "constructor")
                        if (methods.length > 0) {
                            console.log(`  Methods: ${methods.join(", ")}`)
                        }
                    }
                } catch (e: any) {
                    console.log(
                        `  [Error inspecting constructor: ${e.message}]`
                    )
                }
            }
        })

        // Specifically look for credential and presentation classes
        console.log("\nSearching for credential and presentation classes:")
        ;[
            "Credential",
            "VerifiableCredential",
            "Presentation",
            "VerifiablePresentation",
        ].forEach((className) => {
            if (identityWasm[className]) {
                console.log(
                    `- ${className} exists as: ${typeof identityWasm[
                        className
                    ]}`
                )
            } else {
                console.log(`- ${className} does not exist directly`)

                // Try to find similarly named classes
                const similar = Object.keys(identityWasm).filter((key) =>
                    key.toLowerCase().includes(className.toLowerCase())
                )
                if (similar.length > 0) {
                    console.log(`  Similar classes: ${similar.join(", ")}`)
                }
            }
        })
    } catch (error) {
        console.error("Error inspecting module:", error)
    }
}

inspectModule()
