import {
    Client,
    Utils, // Static class for utility functions
    initLogger,
    INodeInfoWrapper, // Correct type for client.getInfo()
} from "@iota/sdk-wasm/node"

const MNEMONIC =
    process.env.MNEMONIC ||
    "acoustic trophy damage hint search taste love bicycle foster cradle brown govern endless depend situate athlete pudding blame question genius transfer van random vast"
const NODE_URL = process.env.NODE_URL || "http://localhost:14265" // Adjust to your IOTA node URL
const JWT_TOKEN = process.env.JWT_TOKEN || "your_generated_jwt_token" // Replace with your JWT token

async function main() {
    try {
        initLogger({
            name: "debug_address.log",
            levelFilter: "debug",
            colorEnabled: true,
        })
        console.log("Logger initialized.")

        console.log(
            "\nListing available static methods on the Utils class from @iota/sdk-wasm/node..."
        )
        const utilProperties = Object.getOwnPropertyNames(Utils)
        console.log("Utils class properties:", utilProperties)
        const utilMethods = utilProperties.filter(
            (prop) => typeof (Utils as any)[prop] === "function"
        )
        console.log("Utils class methods:", utilMethods)

        console.log("\nAttempting to connect to IOTA node...")
        const client = new Client({
            nodes: [NODE_URL],
            // localPow: true, // Optional: enable local PoW if needed for operations
        })
        console.log("Client initialized.")

        console.log("\nFetching node information...")
        const info: INodeInfoWrapper = await client.getInfo()
        console.log("Full Node Info object (INodeInfoWrapper):")
        console.log(JSON.stringify(info, null, 2)) // Log the full object for inspection

        let bech32HrpToUse: string | undefined

        // Try to get bech32Hrp from the info object
        // The exact path can vary; common paths are info.bech32Hrp or info.nodeInfo.protocol.bech32Hrp
        if (
            info.nodeInfo &&
            info.nodeInfo.protocol &&
            info.nodeInfo.protocol.bech32Hrp
        ) {
            bech32HrpToUse = info.nodeInfo.protocol.bech32Hrp
            console.log(
                "\nBech32HRP from info.nodeInfo.protocol.bech32Hrp:",
                bech32HrpToUse
            )
        } else if ((info as any).bech32Hrp) {
            // If it's a direct property (less common for INodeInfoWrapper)
            bech32HrpToUse = (info as any).bech32Hrp
            console.log(
                "\nBech32HRP from info.bech32Hrp (direct property check):",
                bech32HrpToUse
            )
        }

        // Fallback or primary way: use client.getBech32Hrp()
        if (!bech32HrpToUse) {
            try {
                console.log(
                    "\nAttempting to get Bech32HRP using client.getBech32Hrp()..."
                )
                bech32HrpToUse = await client.getBech32Hrp()
                console.log(
                    "Bech32HRP from client.getBech32Hrp():",
                    bech32HrpToUse
                )
            } catch (hrpError) {
                console.error(
                    "Failed to get Bech32HRP using client.getBech32Hrp():",
                    hrpError
                )
            }
        }

        if (!bech32HrpToUse) {
            console.error(
                "\nCRITICAL: Could not determine Bech32HRP. Address generation will likely fail."
            )
            // You might want to throw an error here or set a default if appropriate for your network
        }

        console.log(
            "\nNext steps: Analyze the Utils methods to find the sequence for address generation from mnemonic."
        )
        const hexSeed = Utils.mnemonicToHexSeed(MNEMONIC)
        console.log("Hex seed from mnemonic:", hexSeed)

        console.log(
            "\n(Placeholder for address generation using Utils methods and the determined Bech32HRP)"
        )
        // Example (once methods are known):
        // if (bech32HrpToUse) {
        //     // const keyPair = Utils.someMethodToGenerateKeyPairFromHexSeed(hexSeed);
        //     // const publicKey = keyPair.publicKey;
        //     // const address = Utils.someMethodToConvertPublicKeyToBech32Address(publicKey, bech32HrpToUse);
        //     // console.log("Generated address (example):", address);
        // } else {
        //     console.log("Skipping address generation example as Bech32HRP is unknown.");
        // }
    } catch (error) {
        console.error("Error in debug script:", error)
        if (error instanceof Error && error.stack) {
            console.error("Stack trace:", error.stack)
        }
        process.exit(1)
    }
}

main()
