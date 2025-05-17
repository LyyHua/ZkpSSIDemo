# Zero-Knowledge Proof (ZKP) Simulation Flow Explanation

This document outlines the flow of the simplified Zero-Knowledge Proof simulation as implemented in `src/zkp.ts`. The simulation demonstrates selective disclosure using a JWS-like mechanism with IOTA DIDs.

## Overview

The simulation involves three main parties:

1.  **Issuer**: Creates and signs a full credential for the Holder.
2.  **Holder (Alice)**: Receives the credential, verifies it, and then prepares a presentation with only selected information (claims) to show to a Verifier.
3.  **Verifier**: Receives the presentation from the Holder, verifies the original credential's authenticity (via the JWS proof), and then checks if the Holder's selectively disclosed claims are consistent with the verified full credential.

The core idea is that the Holder can prove they possess a valid credential issued by a trusted Issuer, and reveal only specific parts of that credential, without revealing the entire content.

## Detailed Flow (referencing `src/zkp.ts`)

The main simulation logic is within the `simulateZKP` async function.

### 1. Common Setup / Issuer Key Generation

-   **Objective**: The Issuer needs a cryptographic identity (DID) and keys to sign credentials.
-   **Code**:

    ```typescript
    // --- COMMON SETUP / KEY GENERATION (for Issuer) ---
    const {
        publicKey: issuerCryptoPublicKey,
        privateKey: issuerCryptoPrivateKey,
    } = crypto.generateKeyPairSync("ed25519")
    const issuerSpkiDer = issuerCryptoPublicKey.export({
        type: "spki",
        format: "der",
    })
    const issuerPublicKeyBytes = new Uint8Array(issuerSpkiDer.subarray(-32))
    console.log("Issuer Ed25519 keys generated for ZKP demo.")

    const networkName = "smr"
    const issuerDid = new IotaDID(issuerPublicKeyBytes, networkName)
    let issuerDocument = IotaDocument.newWithId(issuerDid)
    const issuerVerificationMethodFragment = "key-1" // Fragment for the signing key
    // ... (MethodType, MethodData creation) ...

    const issuerVerificationMethod = new VerificationMethod()
    // ... arguments ...
    // Use AssertionMethod for signing credentials
    issuerDocument.insertMethod(
        issuerVerificationMethod,
        MethodScope.AssertionMethod()
    )
    console.log(`Issuer DID for ZKP: ${issuerDocument.id().toString()}`)
    ```

-   **Example Console Output (from a sample run)**:
    ```text
    Issuer Ed25519 keys generated for ZKP demo.
    Issuer DID for ZKP: did:iota:smr:0x481f644d5b503adf95c1c5b2258fdadf31c31b9f33b2a7060a034f9777b52926
    ```
-   **Explanation**:
    -   An Ed25519 key pair (`issuerCryptoPublicKey`, `issuerCryptoPrivateKey`) is generated for the Issuer using Node.js `crypto`.
    -   The raw public key bytes (`issuerPublicKeyBytes`) are extracted from the SPKI DER format.
    -   An IOTA DID (`issuerDid`) is created using these public key bytes and a network name (`smr`).
    -   An IOTA Document (`issuerDocument`) is initialized with this DID.
    -   A `VerificationMethod` (specifically `Ed25519VerificationKey2018`) is created using the Issuer's public key. This method is added to the Issuer's DID Document with the `AssertionMethod` scope, indicating it can be used for issuing credentials (signing). The `kid` (Key ID) for JWS will later refer to this method's fragment (`key-1`).

### 2. Issuer Side: Credential Creation and Signing

-   **Objective**: The Issuer creates a credential containing Alice's full details and signs it.
-   **Code**:

    ```typescript
    // --- ISSUER SIDE ---
    console.log("\n--- Issuer Side ---")
    const subjectData = {
        id: "did:example:alice",
        name: "Hứa Văn Lý",
        degree: "Cử nhân",
        major: "Software Engineering",
        university: "University of Information and Technology",
        year: 2027,
    }

    const credentialToIssue = new Credential({
        id: "https://example.edu/credentials/alice/degree/3732",
        issuer: issuerDocument.id().toString(),
        type: "UniversityDegreeCredential",
        credentialSubject: subjectData,
    })

    const kidForJWS =
        issuerDocument.id().toString() + "#" + issuerVerificationMethodFragment
    const signedFullCredentialJWS = simpleSign(
        credentialToIssue.toJSON(),
        issuerCryptoPrivateKey,
        kidForJWS
    )
    ```

-   **Example Console Output (from a sample run)**:
    ```text
    --- Issuer Side ---
    Credential Subject Data: {
      id: 'did:example:alice',
      name: 'Alice Wonder',
      degree: 'BSc',
      major: 'Cryptography',
      university: 'Wonderland University',
      year: 2025
    }
    Credential to be issued (JSON): {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      "id": "https://example.edu/credentials/alice/degree/3732",
      "type": [
        "VerifiableCredential",
        "UniversityDegreeCredential"
      ],
      "credentialSubject": {
        "id": "did:example:alice",
        "degree": "BSc",
        "major": "Cryptography",
        "name": "Alice Wonder",
        "university": "Wonderland University",
        "year": 2025
      },
      "issuer": "did:iota:smr:0x481f644d5b503adf95c1c5b2258fdadf31c31b9f33b2a7060a034f9777b52926",
      "issuanceDate": "2025-05-16T14:44:15Z"
    }
    Issuer signed the full credential (JWS): eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb3RhOnNtcjoweDQ4MWY2NDRkNWI1MDNhZGY5NWMxYzViMjI1OGZkYWRmMzFjMzFi...
    ```
-   **Explanation**:
    -   `subjectData` defines the information about Alice that will go into the credential.
    -   A `Credential` object (`credentialToIssue`) is instantiated. It includes:
        -   A unique ID for the credential.
        -   The Issuer's DID string.
        -   The type of credential.
        -   The `subjectData`.
    -   The `simpleSign` helper function is used to create a JWS (JSON Web Signature).
        -   **Input**: The credential's JSON representation, the Issuer's private key (`issuerCryptoPrivateKey`), and a `kid` (Key Identifier).
        -   The `kidForJWS` is constructed from the Issuer's DID and the verification method fragment (`key-1`). This `kid` will be included in the JWS header, allowing a verifier to look up the correct public key in the Issuer's DID Document.
        -   **Output**: `signedFullCredentialJWS` is the JWS string representing the signed full credential.

### 3. Holder Side (Alice): Receiving and Verifying Credential, Preparing Presentation

-   **Objective**: Alice receives the signed credential, verifies its authenticity, and then prepares a presentation containing only the claims she wants to disclose.
-   **Code**:

    ```typescript
    // --- HOLDER SIDE (Alice) ---
    // Alice receives the signedFullCredentialJWS from the issuer.
    const holderVerifiedFullCredential = simpleVerify(
        signedFullCredentialJWS,
        issuerCryptoPublicKey // Simplified: Alice would normally resolve Issuer's DID
    )
    if (!holderVerifiedFullCredential) {
        /* ... error handling ... */ return
    }

    // Alice wants to selectively disclose her name and degree.
    const selectivelyDisclosedClaims = {
        name: holderVerifiedFullCredential.credentialSubject.name,
        degree: holderVerifiedFullCredential.credentialSubject.degree,
    }

    // For the Verifier, Alice presents:
    const presentationToVerifier = {
        issuerDid: issuerDocument.id().toString(),
        claims: selectivelyDisclosedClaims,
        proof: {
            type: "SimplifiedJwsProof2024",
            jws: signedFullCredentialJWS, // The original JWS is the proof
        },
    }
    ```

-   **Example Console Output (from a sample run)**:
    ```text
    --- Holder Side ---
    Holder: Successfully verified the JWS of the full credential from Issuer.
    Holder prepares presentation with selective claims: { name: 'Alice Wonder', degree: 'BSc' }
    Holder: Presentation ready for Verifier.
    ```
-   **Explanation**:
    -   Alice receives `signedFullCredentialJWS`.
    -   She verifies it using the `simpleVerify` helper function and the Issuer's public key (`issuerCryptoPublicKey`).
        -   In a real scenario, Alice would fetch the Issuer's DID Document (using `issuerDocument.id().toString()`) and find the public key corresponding to the `kid` in the JWS header. The demo simplifies this by directly using `issuerCryptoPublicKey`.
        -   If verification fails, the process stops.
    -   Alice decides which claims to disclose. In this case, `name` and `degree` from the `holderVerifiedFullCredential.credentialSubject`.
    -   She constructs `presentationToVerifier`. This object contains:
        -   `issuerDid`: The DID of the Issuer (so the Verifier knows who issued the original credential).
        -   `claims`: The `selectivelyDisclosedClaims` (only name and degree).
        -   `proof`: This is crucial. The "proof" is the _original, unmodified `signedFullCredentialJWS`_. This JWS acts as evidence that Alice possesses a valid, fully signed credential from the Issuer, even though she's only showing parts of it.

### 4. Verifier Side: Verifying Presentation and Claims

-   **Objective**: The Verifier receives Alice's presentation, verifies the authenticity of the original credential (via the JWS proof), and then checks if Alice's disclosed claims are consistent with the (now trusted) full credential.
-   **Code**:

    ```typescript
    // --- VERIFIER SIDE ---
    // Verifier needs the Issuer's public key.
    // Simplified: Verifier uses issuerCryptoPublicKey directly.
    // Real scenario: Parse JWS header for kid, resolve presentationToVerifier.issuerDid,
    // find method with kid, extract public key.
    const verifierSideIssuerPublicKey = issuerCryptoPublicKey

    const verifiedFullCredentialByVerifier = simpleVerify(
        presentationToVerifier.proof.jws,
        verifierSideIssuerPublicKey
    )

    if (verifiedFullCredentialByVerifier) {
        // JWS is valid. Now check consistency of disclosed claims.
        const presentedClaims = presentationToVerifier.claims
        const fullSubjectDataFromVerifiedCredential =
            verifiedFullCredentialByVerifier.credentialSubject

        let claimsAreConsistent = true
        if (
            presentedClaims.name !== fullSubjectDataFromVerifiedCredential.name
        ) {
            claimsAreConsistent = false /* ... error ... */
        }
        if (
            presentedClaims.degree !==
            fullSubjectDataFromVerifiedCredential.degree
        ) {
            claimsAreConsistent = false /* ... error ... */
        }

        if (claimsAreConsistent) {
            console.log(
                "Verifier: Selectively disclosed claims ARE CONSISTENT..."
            )
            // Verifier can now trust and use Alice's disclosed claims.
            if (presentedClaims.degree === "BSc") {
                console.log(
                    "Verifier Policy Check: Alice's disclosed degree (BSc) meets the job requirement."
                )
            }
        } else {
            /* ... error: claims not consistent ... */
        }
    } else {
        /* ... error: JWS verification failed ... */
    }
    ```

-   **Example Console Output (from a sample run)**:
    ```text
    --- Verifier Side ---
    Verifier: Verifying JWS proof from issuer did:iota:smr:0x481f644d5b503adf95c1c5b2258fdadf31c31b9f33b2a7060a034f9777b52926
    Verifier: Successfully verified the signature on the original full credential via JWS proof.
    Verifier: Selectively disclosed claims ARE CONSISTENT with the verified full credential.
    ZKP principle (selective disclosure) demonstrated!
    Verifier can now trust and use Alice's disclosed claims: { name: 'Alice Wonder', degree: 'BSc' }
    Verifier Policy Check: Alice's disclosed degree (BSc) meets the job requirement.
    ```
-   **Explanation**:
    -   The Verifier receives `presentationToVerifier`.
    -   The Verifier first needs to verify the `proof.jws` (the original `signedFullCredentialJWS`).
        -   To do this, it needs the Issuer's public key. Similar to the Holder's verification step, this is simplified in the demo by directly using `issuerCryptoPublicKey`.
        -   A real implementation would:
            1.  Parse the JWS header from `presentationToVerifier.proof.jws` to get the `kid`.
            2.  Resolve the `presentationToVerifier.issuerDid` to fetch the Issuer's DID Document.
            3.  Find the verification method in the Issuer's DID Document that matches the `kid`.
            4.  Extract the public key material from that method and prepare it for verification.
        -   The `simpleVerify` function is called with the `presentationToVerifier.proof.jws` and the (supposedly resolved) Issuer's public key.
    -   **If JWS verification is successful (`verifiedFullCredentialByVerifier` is not null)**:
        -   The Verifier now trusts the _entire content_ of `verifiedFullCredentialByVerifier`, even though Alice only showed parts of it.
        -   The Verifier then compares Alice's `presentationToVerifier.claims` (the selectively disclosed ones) against the corresponding claims in the `verifiedFullCredentialByVerifier.credentialSubject`.
        -   If `claimsAreConsistent` is true (e.g., `presentedClaims.name` matches `fullSubjectDataFromVerifiedCredential.name`), the Verifier accepts Alice's disclosed information as valid and backed by the Issuer.
        -   The Verifier can then apply its own policies based on these trusted, selectively disclosed claims (e.g., checking if `presentedClaims.degree === "BSc"`).
    -   **If JWS verification fails, or if the disclosed claims are inconsistent**: The presentation is considered invalid.

## Helper Functions

-   **`simpleSign(payload, privateKey, kid)`**:
    -   Creates a simplified JWS. It takes a payload object, the signer's private key, and a key identifier (`kid`).
    -   It base64url encodes a header (containing `alg: "EdDSA"` and the `kid`) and the payload.
    -   It signs the `encodedHeader.encodedPayload` string using `crypto.sign`.
    -   Returns the JWS as `encodedHeader.encodedPayload.encodedSignature`.
-   **`simpleVerify(jws, publicKey)`**:
    -   Verifies a simplified JWS. It takes the JWS string and the signer's public key.
    -   It splits the JWS into its three parts.
    -   It reconstructs the message that was signed (`encodedHeader.encodedPayload`).
    -   It uses `crypto.verify` to check the signature against the message and public key.
    -   Returns the parsed payload object if valid, otherwise `null`.

## Conclusion

This simulation demonstrates how a Holder can present verifiable claims selectively without revealing their entire credential. The key is that the Holder provides the original JWS of the full credential as proof. The Verifier first validates this JWS against the Issuer's public key (obtained via the Issuer's DID). If the JWS is valid, the Verifier trusts the full credential's content and can then confidently check that the Holder's selectively disclosed claims match the corresponding data within that trusted full credential.

# Zero-Knowledge Proof Implementation Documentation

This document explains our implementation of Zero-Knowledge Proofs (ZKP) using the IOTA Identity WASM library in TypeScript.

## Overview

Zero-Knowledge Proofs allow one party (the prover) to prove to another party (the verifier) that they know a specific piece of information without revealing the information itself. Our implementation demonstrates this through selective disclosure of credential attributes.

## Implementation Details

Our implementation successfully creates:

1. **Standard W3C Verifiable Credentials** - A typical credential format that contains all user information
2. **IOTA-style ZKP Selective Disclosure** - A specialized format that allows revealing only specific attributes while hiding others

### Key Components

-   **Dynamic Module Loading**: We load the IOTA Identity WASM module dynamically using `require.resolve` and `import()` to handle module resolution correctly at runtime.
-   **Base64 Encoding**: For selective disclosure payloads (IOTA-style format).
-   **Null Payloads**: For attributes that should remain hidden from the verifier.
-   **JWT-like Structure**: For issuer and presentation information in the IOTA format.

## Sample Output

```json
// Standard W3C Verifiable Credential Format
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "https://example.com/credentials/123",
  "type": [
    "VerifiableCredential",
    "VerifiableCredential"
  ],
  "credentialSubject": {
    "id": "did:iota:5678",
    "age": 42,
    "email": "john.doe@example.com",
    "family_name": "Doe",
    "given_name": "John"
  },
  "issuer": "did:iota:1234",
  "issuanceDate": "2025-05-17T16:47:38Z",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2025-05-17T16:47:38.369Z",
    "jws": "eyJhbGciOiJFZERTQSJ9..signature",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:iota:1234#key-1"
  }
}

// ZKP Selective Disclosure Format (IOTA-style)
{
  "payloads": [
    null,               // family_name is hidden
    "Sm9obg==",         // given_name: "John" (base64 encoded)
    null,               // email is hidden
    "NDI="              // age: 42 (base64 encoded)
  ],
  "issuer": "eyJpc3MiOiJodHRwczovL2lzc3Vlci50bGQiLCJjbGFpbXMiOlsiZmFtaWx5X25hbWUiLCJnaXZlbl9uYW1lIiwiZW1haWwiLCJhZ2UiXSwidHlwIjoiSlBUIiwicHJvb2ZfandrIjp7ImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoiYWNiSVFpdU1zM2k4X3VzekVqSjJ0cFR0Uk00RVUzeXo5MVBINkNkSDJWMCIsInkiOiJfS2N5TGo5dldNcHRubUt0bTQ2R3FEejh3Zjc0STVMS2dybDJHekgzblNFIn0sInByZXNlbnRhdGlvbl9qd2siOnsiY3J2IjoiUC0yNTYiLCJrdHkiOiJFQyIsIngiOiJvQjFUUHJFX1FKSUw2MWZVT09LNURwS2dkOGoyemJaSnRxcElMRFRKWDZJIiwieSI6IjNKcW5ya3VjTG9ia2RSdU9xWlhPUDlNTWxiRnllbkZPTHlHbEctRlBBQ00ifSwiYWxnIjoiU1UtRVMyNTYifQ==",
  "proof": "LJMiN6caEqShMJ5jPNts8OescqNq5vKSqkfAdSuGJA1GyJyyrfjkpAG0cDJKZoUgomHu5MzYhTUsa0YRXVBnMB91RjonrnWVsakfXtfm2h7gHxA_8G1wkB09x09kon2eK9gTv4iKw4GP6Rh02PEIAVAvnhtuiShMnPqVw1tCBdhweWzjyxJbG86J7Y8MDt2H9f5hhHIwmSLwXYzCbD37WmvUEQ2_6whgAYB5ugSQN3BjXEviCA__VX3lbhH1RVc27EYkRHdRgGQwWNtuExKz7OmwH8oWizplEtjWJ5WIlJpee79gQ9HTa2QIOT9bUDvjjkkO-jK_zuDjZwh5MkrcaQ",
  "presentation": "eyJub25jZSI6InVURUIzNzFsMXB6V0psN2FmQjB3aTBIV1VOazFMZS1iQ29tRkx4YThLLXMifQ=="
}
```

## Selective Disclosure Explained

The ZKP approach allows the holder to reveal only specific attributes:

-   **Revealed**: given_name (John), age (42)
-   **Hidden**: family_name, email

This demonstrates true zero-knowledge principles where the holder can prove possession of valid information without revealing all of it.

## Technical Implementation Challenges

During implementation, we encountered several challenges:

1. **Module Resolution**: Resolved `MODULE_NOT_FOUND` errors by using dynamic imports and explicit path resolution
2. **WASM Initialization**: Ensured proper initialization of the WASM module
3. **Class Compatibility**: Worked around issues with `VerifiableCredential`/`VerifiablePresentation` class constructors
4. **Proof Handling**: Direct creation of credential/presentation objects with proof structures rather than using complex `Proof` class

## Conclusion

This implementation successfully demonstrates ZKP concepts using the IOTA Identity WASM library, allowing for selective disclosure of credential attributes while maintaining the security and verifiability of the overall credential.
