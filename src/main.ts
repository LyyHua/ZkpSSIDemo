import { zkp } from "./zkp-advanced";

export async function main(example?: string) {
    return await zkp();
}

main()
    .catch((error) => {
        console.log("Example error:", error);
    });