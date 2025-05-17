import {
    importIdentityWasm,
    encodeBase64,
    decodeBase64,
    now,
    createDid,
    generateNonce
} from "../shared/iota_identity_client";

/**
 * This example demonstrates a real-world age verification scenario 
 * where a user needs to prove they are over 18 without revealing 
 * their exact date of birth.
 */
export async function ageVerificationExample() {
    try {
        // Import and initialize the WASM module
        const identityWasm = await importIdentityWasm();
        if (typeof identityWasm.start === "function") {
            identityWasm.start();
        }

        console.log("\n=== AGE VERIFICATION EXAMPLE ===\n");
        
        // PART 1: GOVERNMENT IDENTITY PROVIDER (ISSUER)
        console.log("--- GOVERNMENT IDENTITY PROVIDER (ISSUER) ---");
        
        // Create government identity provider DID
        const governmentDid = createDid("gov");
        console.log(`Government DID: ${governmentDid}`);
        
        // Get classes from the WASM module
        const { Credential } = identityWasm;
        
        // Create a user DID (the holder)
        const userDid = createDid("user");
        console.log(`User DID: ${userDid}`);
        
        // Current date for reference (using the year 2025 as specified)
        const currentDate = new Date("2025-05-18");
        
        // Example user was born in 1995 (30 years old in 2025)
        const dateOfBirth = "1995-09-25";
        const birthYear = 1995;
        const age = currentDate.getFullYear() - birthYear;
        
        // Issue a government ID credential with date of birth
        const idCredential = new Credential({
            id: `${governmentDid}#cred-1`,
            type: ["VerifiableCredential", "GovernmentIdCredential"],
            issuer: governmentDid,
            credentialSubject: {
                id: userDid,
                firstName: "Jane",
                lastName: "Citizen",
                dateOfBirth: dateOfBirth,
                nationality: "Iotatopia",
                documentNumber: "IOT-ID-12345678",
                address: "123 Tangle Street, IOTA City, 10101",
                issuanceDate: now()
            },
            issuanceDate: now(),
            expirationDate: new Date(currentDate.getFullYear() + 5, currentDate.getMonth(), currentDate.getDate()).toISOString(),
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1"
            ],
            proof: {
                type: "Ed25519Signature2018",
                created: now(),
                proofPurpose: "assertionMethod",
                verificationMethod: `${governmentDid}#key-1`,
                jws: "eyJhbGciOiJFZERTQSJ9..gov-signature-placeholder"
            }
        });
        
        console.log("Government ID credential issued successfully");
        console.log(`Contains full PII including Date of Birth: ${dateOfBirth}`);
        
        // PART 2: USER/HOLDER CREATES AGE VERIFICATION PRESENTATION
        console.log("\n--- USER/HOLDER CREATES AGE VERIFICATION PRESENTATION ---");
        
        // Website requests age verification with a challenge nonce
        const websiteDid = createDid("website");
        const challengeNonce = generateNonce();
        console.log(`Website ${websiteDid} requests age verification with nonce: ${challengeNonce.substring(0, 12)}...`);
        
        // User decides to create a presentation that only proves they are over 18
        // This uses ZKP selective disclosure to hide the exact date of birth
        
        // Define which claims will be in the presentation
        const claims = ["firstName", "lastName", "dateOfBirth", "documentNumber", "address", "nationality"];
        
        // Create the payloads array with selective disclosure
        // Only firstName and lastName are disclosed, plus a derived "isOver18" claim
        // All other information is hidden (null values)
        const payloads = [
            encodeBase64("Jane"),       // firstName is disclosed 
            encodeBase64("Citizen"),    // lastName is disclosed
            null,                       // dateOfBirth is hidden
            null,                       // documentNumber is hidden
            null,                       // address is hidden
            null,                       // nationality is hidden
            encodeBase64("true")        // derived "isOver18" claim is disclosed
        ];
        
        // Add the isOver18 claim to the original claims list
        const extendedClaims = [...claims, "isOver18"];
        
        // Create the presentation metadata
        const presentationJwt = {
            nonce: challengeNonce,
            purpose: "age verification"
        };
        
        // Issuer metadata
        const issuerJwt = {
            iss: governmentDid,
            claims: extendedClaims,
            typ: "JPT",
            proof_jwk: {
                crv: "P-256",
                kty: "EC",
                x: "acbIQiuMs3i8_uszEjJ2tpTtRM4EU3yz91PH6CdH2V0",
                y: "_KcyLj9vWMptnmKtm46GqDz8wf74I5LKgrl2GzH3nSE"
            },
            presentation_jwk: {
                crv: "P-256",
                kty: "EC",
                x: "oB1TPrE_QJIL61fUOOK5DpKgd8j2zbZJtqpILDTJX6I",
                y: "3JqnrkucLobkdRuOqZXOP9MMlbFyenFOLyGlG-FPACM"
            },
            alg: "SU-ES256"
        };
        
        // Create a simulated proof
        const proof = "AGE_VERIFICATION_PROOF_" + Buffer.from(`${userDid}:${challengeNonce}`).toString('base64');
        
        // Assemble the ZKP presentation
        const ageVerificationPresentation = {
            payloads,
            issuer: encodeBase64(JSON.stringify(issuerJwt)),
            proof,
            presentation: encodeBase64(JSON.stringify(presentationJwt))
        };
        
        console.log("Age verification presentation created successfully");
        console.log("Selectively disclosed information:");
        console.log(`- firstName: ${decodeBase64(payloads[0] as string)}`);
        console.log(`- lastName: ${decodeBase64(payloads[1] as string)}`);
        console.log(`- isOver18: ${decodeBase64(payloads[6] as string)}`);
        console.log("Hidden information:");
        console.log("- dateOfBirth: [HIDDEN]");
        console.log("- documentNumber: [HIDDEN]");
        console.log("- address: [HIDDEN]");
        console.log("- nationality: [HIDDEN]");
        
        // PART 3: WEBSITE VERIFIES THE AGE PROOF
        console.log("\n--- WEBSITE (VERIFIER) VALIDATES AGE VERIFICATION ---");
        
        // Decode the presentation
        const presentationData = JSON.parse(decodeBase64(ageVerificationPresentation.presentation));
        const issuerData = JSON.parse(decodeBase64(ageVerificationPresentation.issuer));
        
        // Verify the nonce
        const nonceVerified = presentationData.nonce === challengeNonce;
        console.log(`Nonce verification: ${nonceVerified ? "✅ VALID" : "❌ INVALID"}`);
        
        // Verify the proof (simulated)
        const proofVerified = ageVerificationPresentation.proof.startsWith("AGE_VERIFICATION_PROOF_");
        console.log(`Proof verification: ${proofVerified ? "✅ VALID" : "❌ INVALID"}`);
        
        // Extract disclosed attributes
        const disclosedAttributes: Record<string, string> = {};
        payloads.forEach((payload, index) => {
            if (payload) {
                const claimName = issuerData.claims[index];
                disclosedAttributes[claimName] = decodeBase64(payload);
            }
        });
        
        // Check if user is over 18
        const isOver18 = disclosedAttributes["isOver18"] === "true";
        
        console.log("\nVerification result:");
        console.log(`User ${disclosedAttributes["firstName"]} ${disclosedAttributes["lastName"]} is over 18: ${isOver18 ? "✅ YES" : "❌ NO"}`);
        
        // Make access decision
        if (isOver18 && nonceVerified && proofVerified) {
            console.log("\n✅ ACCESS GRANTED: User has proven they are over 18 years old");
            console.log("🔒 Privacy preserved: Exact birth date was not revealed");
        } else {
            console.log("\n❌ ACCESS DENIED: Age verification failed");
        }
        
        // Return for testing
        return {
            idCredential,
            ageVerificationPresentation,
            verificationResult: {
                isOver18,
                nonceVerified,
                proofVerified,
                accessGranted: isOver18 && nonceVerified && proofVerified
            }
        };
        
    } catch (error) {
        console.error("Error in age verification example:", error);
        throw error;
    }
}
