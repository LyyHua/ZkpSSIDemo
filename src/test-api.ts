/**
 * Simple IOTA Identity example to check API compatibility
 */
import {
    IotaDocument,
    IotaIdentityClient,
    Storage,
} from "@iota/identity-wasm/node"

// Create a basic function to test API imports
async function testApi() {
    // Just log that we're testing to avoid actual API calls
    console.log("Testing IOTA Identity API imports...")

    // Test that we can access the types
    console.log("IotaDocument:", typeof IotaDocument)
    console.log("IotaIdentityClient:", typeof IotaIdentityClient)
    console.log("Storage:", typeof Storage)
}

testApi()
    .then(() => console.log("API test completed"))
    .catch((err: Error) => console.error(`Error: ${err.message}`))
