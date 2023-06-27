const env_var = {
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    "605215134722-avb9crm185nanp2tju6437f0j7kr193a.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "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",
  SERVER_ROOT_URI: "http://localhost:1777",
  UI_ROOT_URI: "http://localhost:3000",
  JWT_SECRET: "thismustbehardtokrack.!",
  COOKIE_NAME: "auth_token",
};

module.exports = env_var;
