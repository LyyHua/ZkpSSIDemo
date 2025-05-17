import {
    importIdentityWasm,
    encodeBase64,
    decodeBase64,
    now,
    createDid
} from "./shared/iota_identity_client";

export async function simulateZKP() {
    try {
        // Dynamically import the WASM module
        const identityWasm = await importIdentityWasm();

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start();
            console.log("WASM module initialized successfully");
        }

        // Standard W3C credential (for reference)
        const { Credential, Presentation } = identityWasm;

        // Create DID identifiers for the issuer and holder
        const issuerDid = createDid("issuer");
        const holderDid = createDid("holder");

        const standardCredential = new Credential({
            id: "https://example.com/credentials/123",
            type: ["VerifiableCredential"],
            issuer: issuerDid,
            credentialSubject: {
                id: holderDid,
                given_name: "John",
                family_name: "Doe",
                email: "john.doe@example.com",
                age: 42,
            },
            issuanceDate: now(),
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            proof: {
                type: "Ed25519Signature2018",
                created: now(),
                proofPurpose: "assertionMethod",
                verificationMethod: `${issuerDid}#key-1`,
                jws: "eyJhbGciOiJFZERTQSJ9..signature",
            },
        });

        // Now let's create a ZKP-style selective disclosure presentation
        // This simulates revealing only the 'age' attribute and hiding others

        // 1. Create the selective disclosure payloads (similar to IOTA's format)
        // null means the value is not disclosed
        const payloads = [
            null, // family_name is hidden
            encodeBase64("John"), // given_name is disclosed
            null, // email is hidden
            encodeBase64("42"), // age is disclosed
        ];

        // 2. Create the presentation JWT with a nonce (to prevent replay attacks)
        const presentationJwt = {
            nonce: "uTEB371l1pzWJl7afB0wi0HWUNk1Le-bComFLxa8K-s",
        };

        // 3. Simulate the issuer JWT with metadata about the credential
        const issuerJwt = {
            iss: issuerDid,
            claims: ["family_name", "given_name", "email", "age"],
            typ: "JPT",
            proof_jwk: {
                crv: "P-256",
                kty: "EC",
                x: "acbIQiuMs3i8_uszEjJ2tpTtRM4EU3yz91PH6CdH2V0",
                y: "_KcyLj9vWMptnmKtm46GqDz8wf74I5LKgrl2GzH3nSE",
            },
            presentation_jwk: {
                crv: "P-256",
                kty: "EC",
                x: "oB1TPrE_QJIL61fUOOK5DpKgd8j2zbZJtqpILDTJX6I",
                y: "3JqnrkucLobkdRuOqZXOP9MMlbFyenFOLyGlG-FPACM",
            },
            alg: "SU-ES256",
        };

        // 4. Create a simulated cryptographic proof (in a real implementation this would be generated using the WASM library)
        const proof =
            "LJMiN6caEqShMJ5jPNts8OescqNq5vKSqkfAdSuGJA1GyJyyrfjkpAG0cDJKZoUgomHu5MzYhTUsa0YRXVBnMB91RjonrnWVsakfXtfm2h7gHxA_8G1wkB09x09kon2eK9gTv4iKw4GP6Rh02PEIAVAvnhtuiShMnPqVw1tCBdhweWzjyxJbG86J7Y8MDt2H9f5hhHIwmSLwXYzCbD37WmvUEQ2_6whgAYB5ugSQN3BjXEviCA__VX3lbhH1RVc27EYkRHdRgGQwWNtuExKz7OmwH8oWizplEtjWJ5WIlJpee79gQ9HTa2QIOT9bUDvjjkkO-jK_zuDjZwh5MkrcaQ";

        // 5. Assemble the final ZKP selective disclosure presentation
        const zkpPresentation = {
            payloads,
            issuer: encodeBase64(JSON.stringify(issuerJwt)),
            proof,
            presentation: encodeBase64(JSON.stringify(presentationJwt)),
        };

        // Output both the standard W3C VC/VP format and the ZKP selective disclosure format
        console.log("\nStandard W3C Verifiable Credential Format:");
        console.log(JSON.stringify(standardCredential, null, 2));

        console.log("\nZKP Selective Disclosure Format (IOTA-style):");
        console.log(JSON.stringify(zkpPresentation, null, 2));

        // For demonstration, show what data is being selectively disclosed
        console.log("\nSelectively Disclosed Data:");
        console.log("- given_name:", decodeBase64(payloads[1] as string));
        console.log("- age:", decodeBase64(payloads[3] as string));
        console.log("- family_name: [HIDDEN]");
        console.log("- email: [HIDDEN]");

        return {
            standardCredential,
            zkpPresentation,
        };
    } catch (error: any) {
        console.error("Error in simulateZKP:", error);
        throw error;
    }
}
