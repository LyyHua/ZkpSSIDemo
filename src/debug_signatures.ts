const iotaShared = require("./shared/iota_identity_client");

console.log("newDidOutput Signature:", iotaShared.IotaIdentityClient.prototype.newDidOutput.toString());
console.log("publishDidOutput Signature:", iotaShared.IotaIdentityClient.prototype.publishDidOutput.toString());
