/**
 * Runner for all IOTA Identity ZKP examples
 *
 * This file runs all the actual IOTA Identity implementations
 * to demonstrate various ZKP capabilities.
 */

import createActualIotaZkp from "./actual_iota_zkp"
import iotaAgeVerification from "./examples/iota_age_verification"
import healthCredentialExample from "./examples/health_credential"

async function runAllIotaExamples() {
    console.log("=================================================")
    console.log("      IOTA IDENTITY ZKP EXAMPLES")
    console.log("=================================================")

    try {
        // 1. Run the basic implementation
        console.log("\n\n===== BASIC IOTA IDENTITY ZKP IMPLEMENTATION =====\n")
        await createActualIotaZkp()

        // 2. Run the age verification example
        console.log("\n\n===== AGE VERIFICATION EXAMPLE =====\n")
        await iotaAgeVerification()

        // 3. Run the health credential example
        console.log("\n\n===== HEALTH CREDENTIAL EXAMPLE =====\n")
        await healthCredentialExample()

        console.log("\n\n=================================================")
        console.log("      ALL EXAMPLES COMPLETED SUCCESSFULLY")
        console.log("=================================================")
    } catch (error) {
        console.error("Error running IOTA Identity examples:", error)
    }
}

// When this file is run directly, execute the main function
if (require.main === module) {
    runAllIotaExamples().catch((error) => {
        console.error("Fatal error:", error)
        process.exit(1)
    })
}

export default runAllIotaExamples
