import { simulateZKP } from "./zkp"
import { verifyPresentation } from "./verifier"
import { advancedZkpDemo } from "./advanced_zkp"
import { runExamples } from "./examples"

async function runBasicDemo() {
    console.log("\n=== BASIC ZKP DEMONSTRATION ===")
    console.log(
        "\n--- 1. ISSUER & HOLDER: Creating Credential and Presentation ---"
    )
    const result = await simulateZKP()
    console.log("--- Simulation completed successfully ---")

    // Simulate verification with the expected nonce
    // In a real scenario, this nonce would be provided by the verifier
    const expectedNonce = "uTEB371l1pzWJl7afB0wi0HWUNk1Le-bComFLxa8K-s"
    console.log("\n--- 2. VERIFIER: Validating Presentation ---")
    const verificationResult = await verifyPresentation(
        result.zkpPresentation,
        expectedNonce
    )

    if (verificationResult.valid) {
        console.log("\n=== VERIFICATION SUCCESSFUL ===")
        console.log(
            "The presentation has been verified and contains the following attributes:"
        )
        if (verificationResult.disclosedAttributes) {
            Object.entries(verificationResult.disclosedAttributes).forEach(
                ([key, value]) => {
                    console.log(`- ${key}: ${value}`)
                }
            )
        }
    } else {
        console.error("\n=== VERIFICATION FAILED ===")
        console.error("Error:", verificationResult.error)
    }
}

async function main() {
    try {
        console.log("=== IOTA ZKP DEMONSTRATION ===")

        // Check for command line arguments to determine which demo to run
        const args = process.argv.slice(2)
        const demoType = args[0] || "basic" // Default to basic demo

        if (demoType === "advanced") {
            await advancedZkpDemo()
        } else if (demoType === "examples") {
            await runExamples()
        } else if (demoType === "all") {
            await runBasicDemo()
            console.log("\n\n")
            await advancedZkpDemo()
            console.log("\n\n")
            await runExamples()
        } else {
            await runBasicDemo()
        }

        console.log("\n=== DEMONSTRATION COMPLETED SUCCESSFULLY ===")
    } catch (error) {
        console.error("Error during ZKP demonstration:", error)
        if (error instanceof Error && error.stack) {
            console.error("Stack trace:", error.stack)
        }
        process.exit(1)
    }
}

main()

main()

main()
