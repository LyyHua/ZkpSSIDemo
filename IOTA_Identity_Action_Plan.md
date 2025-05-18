# IOTA Identity ZKP Integration Action Plan

This document outlines the steps needed to properly implement Zero-Knowledge Proof Selective Disclosure using the actual IOTA Identity WASM library instead of our current simulation.

## Current Issue

Our attempt to use the `SelectiveDisclosurePresentation` class from IOTA Identity resulted in the error:

```
Error: expected instance of JwpIssued
```

This indicates our implementation approach doesn't match the expected API usage of the IOTA Identity library.

## Step-by-Step Action Plan

### 1. Research and Documentation Review

-   [ ] **Review Official Documentation**

    -   Review the [IOTA Identity Wiki](https://wiki.iota.org/identity/welcome/) with focus on selective disclosure
    -   Study the [JSON Proof Token (JPT)](https://wiki.iota.org/identity/specifications/json-web-proof/) specification
    -   Examine any example code provided by IOTA for selective disclosure

-   [ ] **Investigate Type Definitions**
    -   Verify our type definitions match the current IOTA Identity WASM library version
    -   Understand the relationship between `JwpIssued` and `SelectiveDisclosurePresentation`

### 2. Implement Proper DID Creation

-   [ ] **Create Proper IOTA DIDs**
    -   Implement DID creation using `IotaDocument` class
    -   Set up appropriate verification methods (BLS12-381)
    -   Register DIDs (simulated network for testing)

### 3. Implement Proper Credential Creation

-   [ ] **Create Credentials with BLS12-381 Signatures**
    -   Use `IotaDocument.createCredentialJpt()` method
    -   Configure proper verification methods
    -   Implement credential issuance flow

### 4. Implement Selective Disclosure Presentation

-   [ ] **Create a JwpIssued Instance**

    -   Understand how to create a valid instance of the JwpIssued class
    -   Properly configure it with credential data

-   [ ] **Use SelectiveDisclosurePresentation Correctly**
    -   Pass a properly created JwpIssued instance to the constructor
    -   Use the concealInSubject() method to hide specific attributes
    -   Create a presentation JWT with proper challenge and domain

### 5. Implement Proper Verification

-   [ ] **Set Up a Resolver**

    -   Configure a proper Resolver for DID resolution
    -   Connect it with the simulated network (or testnet)

-   [ ] **Use JptPresentationValidator Correctly**
    -   Create a validator with the resolver
    -   Implement proper verification with challenge validation

### 6. Testing

-   [ ] **Unit Tests**

    -   Test each component independently
    -   Verify error handling and edge cases

-   [ ] **Integration Tests**
    -   Test the full flow from issuance to verification
    -   Verify selective disclosure works as expected

### 7. Documentation Updates

-   [ ] **Update Technical Documentation**

    -   Explain how the actual IOTA Identity ZKP implementation works
    -   Document any workarounds needed
    -   Create a guide for future developers

-   [ ] **Update Examples**
    -   Update examples to use the actual IOTA Identity implementation
    -   Provide detailed comments explaining each step

## Resources

1. [IOTA Identity Wiki](https://wiki.iota.org/identity/welcome/)
2. [IOTA Identity Selective Disclosure Tutorial](https://wiki.iota.org/identity/tutorials/selective-disclosure/)
3. [JSON Proof Token Specification](https://wiki.iota.org/identity/specifications/json-web-proof/)
4. [IOTA Identity GitHub Repository](https://github.com/iotaledger/identity.rs)

## Timeline

1. Research and planning: 1-2 days
2. DID and credential implementation: 2-3 days
3. Selective disclosure implementation: 2-3 days
4. Verification implementation: 1-2 days
5. Testing and documentation: 2-3 days

Total estimated time: 8-13 days

## Fallback Plan

If full integration with IOTA Identity's ZKP capabilities proves challenging due to documentation or API issues, we'll:

1. Continue using our simulated implementation for demonstrations
2. Clearly document the limitations and simulation aspects
3. Submit issues or questions to the IOTA Identity team
4. Focus on completing other aspects of the project while waiting for responses
