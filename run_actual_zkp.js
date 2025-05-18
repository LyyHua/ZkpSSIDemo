/**
 * Runner script for the actual IOTA ZKP implementation
 */

const path = require("path")
process.env.NODE_PATH = path.join(__dirname, "dist")
require("module").Module._initPaths()

try {
    // First try to run the actual implementation
    console.log("Attempting to run the actual IOTA ZKP implementation...")
    require("./dist/actual_iota_zkp")
} catch (error) {
    console.error("Error running the actual IOTA ZKP implementation:", error)
}
