const iotaSharedClient = require("./shared/iota_identity_client")

console.log(
    "Address Type:",
    Object.getOwnPropertyNames(
        iotaSharedClient.IotaIdentityClient.prototype.newDidOutput.arguments[0]
    )
)
console.log(
    "SecretManagerType:",
    Object.getOwnPropertyNames(
        iotaSharedClient.IotaIdentityClient.prototype.publishDidOutput
            .arguments[0]
    )
)
