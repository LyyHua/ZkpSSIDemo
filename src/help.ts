/**
 * This script provides help information about the available
 * demos and documentation in the project.
 */
function printHelp() {
    console.log(`
=====================================================
IOTA IDENTITY ZKP DEMONSTRATION - HELP
=====================================================

Available Demo Commands:
-----------------------
npm run start:basic      - Run the basic ZKP demonstration
npm run start:advanced   - Run the advanced BBS+ demonstration 
npm run start:examples   - Run real-world examples
npm run start:all        - Run all demonstrations

Development Commands:
-------------------
npm run dev:basic        - Build and run basic demo
npm run dev:advanced     - Build and run advanced demo
npm run dev:examples     - Build and run examples
npm run dev:all          - Build and run all demos

Documentation Files:
------------------
IOTA_ZKP_Selective_Disclosure.md  - Detailed implementation explanation
Verification_Process.md           - Verification flow documentation
When_To_Use_ZKP.md                - Use case guidelines
SSI_ZKP_Glossary.md               - Technical terminology
ZKP_Flow_Diagram.md               - Visual flow diagrams
Implementation_Summary.md         - Project summary

Project Structure:
----------------
src/
  ├── zkp.ts               - Basic ZKP implementation
  ├── advanced_zkp.ts      - Advanced ZKP with BBS+
  ├── verifier.ts          - Verification implementation
  ├── examples/            - Real-world examples
  │   └── age_verification.ts - Age verification example
  └── shared/              - Shared utilities

For more information, please refer to the documentation files.
=====================================================
`)
}

// If this script is run directly
if (require.main === module) {
    printHelp()
}

export { printHelp }
