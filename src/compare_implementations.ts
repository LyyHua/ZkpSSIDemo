/**
 * Main file to compare simulated ZKP vs actual IOTA Identity ZKP implementation
 */

import { simulateZKP } from "./zkp"
import createActualIotaZkp from "./actual_iota_zkp"
import ageVerificationExample from "./examples/iota_age_verification"

async function main() {
    console.log("=================================================")
    console.log("    COMPARING ZKP IMPLEMENTATIONS")
    console.log("=================================================")

    try {
        // Run the simulated ZKP implementation
        console.log("\n\n========== SIMULATED ZKP IMPLEMENTATION ==========\n")
        await simulateZKP()

        // Run the actual IOTA Identity ZKP implementation
        console.log(
            "\n\n========== ACTUAL IOTA IDENTITY ZKP IMPLEMENTATION ==========\n"
        )
        await createActualIotaZkp()

        // Run the age verification example
        console.log("\n\n========== AGE VERIFICATION EXAMPLE ==========\n")
        await ageVerificationExample()

        console.log("\n\n=================================================")
        console.log("    IMPLEMENTATION COMPARISON COMPLETE")
        console.log("=================================================")
        console.log(
            "\nRefer to IOTA_ZKP_Implementation_Explained.md for a detailed comparison"
        )
    } catch (error) {
        console.error("Error running the implementations:", error)
    }
}

// Run the main function
main().catch(console.error)

// When this file is run directly, execute the main function
if (require.main === module) {
    main().catch((error) => {
        console.error("Error running implementation comparison:", error)
        process.exit(1)
    })
}

export default main
