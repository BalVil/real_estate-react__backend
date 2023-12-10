import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
dotenv.config();

const jwtCheck = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  tokenSigningAlg: "RS256",
});

export default jwtCheck;
