// mongodb://admin:admin@ds111895.mlab.com:11895/dinnerbell
// `mongodb://${config.host}/${config.database}`

const env = process.env.NODE_ENV || "development";
const config = require("./mongoose.json")[env];
module.exports =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://admin:admin@ds111895.mlab.com:11895/dinnerbell`;
