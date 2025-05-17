import {
    importIdentityWasm,
    decodeBase64,
    parseDid,
} from "./shared/iota_identity_client"

// Types for the presentation format
interface ZkpPresentation {
    payloads: (string | null)[]
    issuer: string
    proof: string
    presentation: string
}

interface IssuerJwt {
    iss: string
    claims: string[]
    typ: string
    proof_jwk: {
        crv: string
        kty: string
        x: string
        y: string
    }
    presentation_jwk: {
        crv: string
        kty: string
        x: string
        y: string
    }
    alg: string
}

interface PresentationJwt {
    nonce: string
}

export async function verifyPresentation(
    zkpPresentation: ZkpPresentation,
    expectedNonce: string
) {
    try {
        // Import and initialize WASM module
        const identityWasm = await importIdentityWasm()
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
        }

        console.log(
            "\n===== VERIFIER: Starting Presentation Verification ====="
        )

        // Step 1: Decode the issuer metadata
        const issuerJwtStr = decodeBase64(zkpPresentation.issuer)
        const issuerJwt: IssuerJwt = JSON.parse(issuerJwtStr)

        console.log(`Issuer: ${issuerJwt.iss}`)

        // Parse the DID to get more information (if it's a valid DID)
        try {
            if (issuerJwt.iss.startsWith("did:")) {
                const didInfo = parseDid(issuerJwt.iss)
                console.log(
                    `DID Method: ${didInfo.method}${
                        didInfo.network ? ", Network: " + didInfo.network : ""
                    }`
                )
            }
        } catch (err) {
            console.log("Invalid DID format")
        }

        console.log(`Claim types: ${issuerJwt.claims.join(", ")}`)

        // Step 2: Decode the presentation metadata
        const presentationJwtStr = decodeBase64(zkpPresentation.presentation)
        const presentationJwt: PresentationJwt = JSON.parse(presentationJwtStr)

        // Step 3: Verify the nonce matches (preventing replay attacks)
        const nonceValid = presentationJwt.nonce === expectedNonce
        console.log(
            `Nonce verification: ${nonceValid ? "✅ VALID" : "❌ INVALID"}`
        )

        if (!nonceValid) {
            throw new Error(
                "Presentation nonce does not match expected challenge"
            )
        }

        // Step 4: In a real implementation, we would verify the cryptographic proof
        // Using the Issuer's DID and the proof in the presentation
        console.log(`Proof validation: ✅ VALID (simulated)`)

        // Step 5: Extract and process the selectively disclosed attributes
        console.log("\nSelectively Disclosed Attributes:")

        // Map payloads back to their attribute names using the claims array
        const disclosedAttributes: Record<string, string> = {}

        zkpPresentation.payloads.forEach((payload, index) => {
            const attributeName = issuerJwt.claims[index]

            if (payload !== null) {
                const value = decodeBase64(payload)
                disclosedAttributes[attributeName] = value
                console.log(`✅ ${attributeName}: ${value}`)
            } else {
                console.log(`❌ ${attributeName}: [HIDDEN]`)
            }
        })

        console.log(
            "\n===== VERIFIER: Presentation Verification Complete ====="
        )

        // Return the verification result with the disclosed attributes
        return {
            valid: true,
            nonceValid,
            issuer: issuerJwt.iss,
            disclosedAttributes,
        }
    } catch (error) {
        console.error("Error verifying presentation:", error)
        return {
            valid: false,
            error: error instanceof Error ? error.message : String(error),
        }
    }
}
