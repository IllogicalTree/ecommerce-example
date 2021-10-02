// Full disclosure, this has been taken directly from the getting-started project at https://github.com/IBM-Cloud/get-started-node/blob/master/server.js
// It supports what seems like every authentication method known to man, in short; if we are testing locally it will use a local config file,
// If deployed it will get the credentials it needs from the cloud foundry environment

var cfenv = require("cfenv");
var vcapLocal;
var cloudant;

try {
  vcapLocal = require("./vcap-local.iam.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {}

const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {};

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (
  appEnv.services["cloudantNoSQLDB"] ||
  appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)
) {
  // Load the Cloudant library.
  var Cloudant = require("@cloudant/cloudant");

  // Initialize database with credentials
  if (appEnv.services["cloudantNoSQLDB"]) {
    cloudant = Cloudant(appEnv.services["cloudantNoSQLDB"][0].credentials);
  } else {
    // user-provided service with 'cloudant' in its name
    cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }
} else if (process.env.CLOUDANT_URL) {
  // Load the Cloudant library.
  var Cloudant = require("@cloudant/cloudant");

  if (process.env.CLOUDANT_IAM_API_KEY) {
    // IAM API key credentials
    let cloudantURL = process.env.CLOUDANT_URL;
    let cloudantAPIKey = process.env.CLOUDANT_IAM_API_KEY;
    cloudant = Cloudant({
      url: cloudantURL,
      plugins: { iamauth: { iamApiKey: cloudantAPIKey } },
    });
  } else {
    //legacy username/password credentials as part of cloudant URL
    cloudant = Cloudant(process.env.CLOUDANT_URL);
  }
}

let dbName = "products";

cloudant.db.create(dbName, (err, data) => {
  if (!err) console.log("created database " + dbName);
});

const db = cloudant.db.use(dbName);

module.exports = db;
