//Services to access DB
const { findUser, updateUser } = require('../services/userServices')

//require for token
const jwt = require('jsonwebtoken');


const generateAuthTokens = async (email: string, id: number, roleCode: number) => {

    // create JWTs:
    const payload = { 
        "UserInfo": {
            "email": email,
            "id": id,
            "roles": roleCode
        } 
    };

    const secretAccess = process.env.ACCESS_TOKEN_SECRET;
    const expireAccess = {expiresIn: "15m"}
    const accessToken = jwt.sign(payload, secretAccess, expireAccess);

    const secretRefresh = process.env.REFRESH_TOKEN_SECRET;
    const expireRefresh = {expiresIn: "7d"}
    const refreshToken = jwt.sign(payload, secretRefresh, expireRefresh);

    return { accessToken, refreshToken };
}

module.exports = { 
    generateAuthTokens 
};