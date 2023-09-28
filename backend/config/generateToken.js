//Import the 'jsonwebtoken' library, to generate JSON Web Tokens
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Exporting the generated token
module.exports = generateToken;
