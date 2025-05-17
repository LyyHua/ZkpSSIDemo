import { simulateZKP } from "./zkp"

async function main() {
    try {
        console.log("Starting ZKP simulation...")
        const result = await simulateZKP()
        console.log("ZKP simulation completed successfully")
    } catch (error) {
        console.error("Error during ZKP simulation:", error)
        if (error instanceof Error && error.stack) {
            console.error("Stack trace:", error.stack)
        }
        process.exit(1)
    }
}

main()
