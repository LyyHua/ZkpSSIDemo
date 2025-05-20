import { zkp } from "./zkp"
import zkpLocal from "./zkp-local"

export async function main(example?: string) {
    switch (example) {
        case "local":
            console.log("Running local ZKP implementation (offline)...")
            return await zkpLocal()
        default:
            console.log("Running standard ZKP implementation...")
            return await zkp()
    }
}

main(process.argv[2]).catch((error) => {
    console.log("Example error:", error)
})
