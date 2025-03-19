const { findUser } = require("../repositories/userRepository");
const argon2 = require('argon2');  // Use argon2 for password comparison
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require("../config/serverConfig");

async function loginUser(authDetails) {
    const email = authDetails.email;
    const plainPassword = authDetails.password;

    // 1. Check if there is a registered user with the given email
    const user = await findUser({ email });

    if (!user) {
        throw { message: "No user found with the given email", statusCode: 404 };
    }

    // 2. If the user is found, we need to compare plainIncomingPassword with hashedPass
    // Replaced bcrypt.compare with argon2.verify for password validation
    const isPasswordValidated = await argon2.verify(user.password, plainPassword);

    if (!isPasswordValidated) {
        throw { message: "Invalid password, please try again", statusCode: 401 };
    }

    const userRole = user.role ? user.role : "USER";

    // 3. If the password is validated, create a token and return it
    const token = jwt.sign({ email: user.email, id: user._id, role: userRole }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });

    return { token, userRole, userData: {
        email: user.email,
        firstName: user.firstName,
    }};
}

module.exports = {
    loginUser
};
