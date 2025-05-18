# IOTA Identity ZKP Implementation Update

## Summary of Changes

We've updated the project to use the actual IOTA Identity WASM library's ZKP capabilities instead of simulating them. The changes focus on implementing the proper SelectiveDisclosurePresentation approach used by IOTA Identity.

### Implementation Details

1. **Added New Implementation Files:**

    - `zkp_with_iota.ts`: Core ZKP implementation using IOTA Identity
    - `advanced_zkp_with_iota.ts`: Advanced BBS+ implementation using IOTA Identity
    - `verifier_with_iota.ts`: Verification using IOTA Identity validators
    - `examples/age_verification_with_iota.ts`: Age verification example with IOTA Identity

2. **Key Classes Used:**

    - `SelectiveDisclosurePresentation`: For creating selective disclosure
    - `JptPresentationValidator`: For validating presentations
    - `Resolver`: For resolving DIDs (simulated in this context)

3. **Implementation Flow:**
    - Create credential using IOTA Identity's Credential class
    - Create selective disclosure presentation using concealInSubject() method
    - Generate presentation JWT with challenge and domain
    - Verify presentation using JptPresentationValidator

### Key Differences from Simulated Approach

| Feature              | Simulated Implementation  | IOTA Identity Implementation                                  |
| -------------------- | ------------------------- | ------------------------------------------------------------- |
| Selective Disclosure | Manual arrays of payloads | SelectiveDisclosurePresentation class with concealInSubject() |
| Proof Generation     | Manual JSON structure     | Proper JWT creation with createPresentationJpt()              |
| Verification         | Custom verification logic | JptPresentationValidator with proper checks                   |
| Credential Format    | Manual JSON credential    | IOTA Identity Credential class                                |

### How to Run

To run the new IOTA Identity implementation:

```bash
npm run dev:iota
```

To run all examples (both simulated and IOTA implementations):

```bash
npm run dev:all
```

### Next Steps

1. **Integrate with IOTA Network**: Connect to a real IOTA network for DID operations
2. **Use Real Cryptography**: Implement actual BLS signatures instead of simulated ones
3. **Add Credential Revocation**: Implement revocation checking
4. **Add Key Management**: Implement secure key generation and storage

### Usage Recommendations

It's recommended to use the IOTA Identity implementation (`npm run start:iota`) as it follows the proper IOTA Identity library approach and is more security-focused than the simulated implementation.
