import { ageVerificationExample } from "./age_verification"

export { ageVerificationExample }

export async function runExamples() {
    console.log("=== RUNNING REAL-WORLD ZKP EXAMPLES ===")

    try {
        // Age verification example
        await ageVerificationExample()
    } catch (error) {
        console.error("Error running examples:", error)
    }
}
