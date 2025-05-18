/**
 * IOTA Identity ZKP Examples
 *
 * This file serves as the main entry point for running different ZKP examples:
 * - 'real': Uses the actual IOTA Identity WASM library for ZKP with BBS+ signatures
 * - 'advanced': Uses a more advanced simulation with actual IOTA Identity classes
 * - 'simulation': Uses a very simplified simulation approach
 */

async function runExample(name: string) {
    console.log(`Starting example: ${name}`)
    try {
        switch (name) {
            case "real":
                // Try to run the full implementation, but this will likely fail without a network
                try {
                    const { zkp } = await import("./example/zkp-implementation")
                    await zkp()
                } catch (error) {
                    console.error("Error running real implementation:", error)
                    console.log("Falling back to advanced simulation...")
                    const { zkp: advancedZkp } = await import(
                        "./example/zkp-advanced"
                    )
                    await advancedZkp()
                }
                break
            case "advanced":
                // Run the advanced implementation that uses IOTA Identity classes
                const { zkp: advancedZkp } = await import(
                    "./example/zkp-advanced"
                )
                await advancedZkp()
                break
            case "simulation":
            default:
                // Run the simple simulation
                const { run } = await import("./example/zkp-simple")
                await run()
                break
        }
    } catch (error) {
        console.error(`Error running example ${name}:`, error)
    }
}

// Get the example name from command line arguments
const exampleName = process.argv[2] || "simulation"
runExample(exampleName).catch(console.error)
