const iotaClientShared = require("./shared/iota_identity_client")

console.log(
    "Address Type:",
    iotaClientShared.IotaIdentityClient.prototype.newDidOutput.toString()
)
console.log(
    "SecretManagerType:",
    iotaClientShared.IotaIdentityClient.prototype.publishDidOutput.toString()
)
