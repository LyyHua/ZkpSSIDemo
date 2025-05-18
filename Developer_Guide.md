# Developer Guide: Working with the ZKP Implementation

This guide provides information and recommendations for developers working with this Zero-Knowledge Proof (ZKP) implementation project.

## Project Overview

The project demonstrates Zero-Knowledge Proof Selective Disclosure in the context of Self-Sovereign Identity (SSI). It consists of:

1. A **simulated implementation** that demonstrates the concepts without using actual cryptography
2. An **IOTA Identity implementation** attempt that aims to use the actual IOTA Identity library's ZKP capabilities

## Getting Started

### Setting Up the Development Environment

1. Clone the repository
2. Install dependencies:
    ```powershell
    npm install
    ```
3. Build the project:
    ```powershell
    npm run build
    ```
4. Run the simulated implementation:
    ```powershell
    npm run dev:basic   # Basic demonstration
    npm run dev:advanced # Advanced BBS+ demonstration
    npm run dev:examples # Real-world examples
    ```

### Project Structure Overview

-   `src/zkp.ts`: Basic simulated ZKP implementation
-   `src/advanced_zkp.ts`: Advanced simulated ZKP with BBS+
-   `src/verifier.ts`: Verification for simulated implementations
-   `src/examples/`: Real-world examples using simulated implementation
-   `src/shared/`: Shared utilities
-   Files with `_with_iota` suffix: IOTA Identity implementation attempts

## Working with the Simulated Implementation

The simulated implementation is fully functional and demonstrates the ZKP concepts clearly:

### Key Components:

1. **Credential Creation**: `simulateZKP()` in `zkp.ts` creates a standard W3C credential
2. **Selective Disclosure**: Uses an array of payloads with `null` for hidden attributes
3. **Verification**: `verifyPresentation()` in `verifier.ts` validates the presentation

### Extending the Simulated Implementation:

-   Add new credential types in `src/zkp.ts` or `src/advanced_zkp.ts`
-   Create new examples in `src/examples/`
-   Enhance the verification logic in `src/verifier.ts`

## IOTA Identity Implementation Status

The attempt to implement ZKP using the actual IOTA Identity library is currently facing challenges:

### Current Issues:

-   The `SelectiveDisclosurePresentation` class requires a `JwpIssued` instance
-   Our implementation approach doesn't match the expected API usage
-   Further research into the IOTA Identity API is needed

### Working on the IOTA Identity Implementation:

If you want to continue working on the IOTA Identity implementation:

1. Review the [IOTA_Identity_Action_Plan.md](./IOTA_Identity_Action_Plan.md)
2. Study the IOTA Identity documentation thoroughly
3. Understand the error messages and API requirements
4. Make incremental changes, testing each step

## Best Practices

1. **Always Run Tests**: Ensure your changes don't break existing functionality

    ```powershell
    npm run dev:all
    ```

2. **Documentation**: Update documentation when making significant changes

3. **Error Handling**: Implement robust error handling, especially when working with the WASM library

4. **Type Safety**: Use proper TypeScript types and avoid `any` where possible

5. **Incremental Changes**: Make small, incremental changes and test frequently

## Common Issues and Solutions

### Module Not Found Errors

If you encounter module resolution issues:

```powershell
# Check module path
$modulePath = Resolve-Path "./node_modules/@iota/identity-wasm/node/identity_wasm.js"
echo $modulePath
```

### Type Definition Issues

If TypeScript complains about missing types:

1. Check the type definitions in `@types/iota-identity-wasm/index.d.ts`
2. Update them to match the actual library API
3. Use type assertions when necessary (`as` keyword)

### WASM Initialization Errors

If WASM fails to initialize:

1. Ensure the WASM module is properly imported
2. Call `identityWasm.start()` before using any IOTA Identity classes
3. Check for any console errors related to memory or initialization

## Resources

-   [IOTA Identity Wiki](https://wiki.iota.org/identity/welcome/)
-   [IOTA Identity Selective Disclosure Tutorial](https://wiki.iota.org/identity/tutorials/selective-disclosure/)
-   [JSON Proof Token Specification](https://wiki.iota.org/identity/specifications/json-web-proof/)
-   [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Getting Help

If you're stuck on an issue:

1. Check the error message carefully
2. Review the IOTA Identity documentation
3. Look for similar issues in the IOTA Identity GitHub repository
4. Use the debug utilities in the `src/debug_*.ts` files to inspect the library

Happy coding!
