import { zkp } from "./zkp"
import zkpLocal from "./zkp-local"

export async function main(example?: string) {
    if (example === "local") {
        return await zkpLocal()
    } else {
        return await zkp()
    }
}

main(process.argv[2]).catch((error) => {
    console.log("Example error:", error)
})
