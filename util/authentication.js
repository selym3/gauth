/**
 * This code is responsible for authenticating the google sign in, 
 * e.g. proving that it is valid.
 * 
 * This process is followed from here (https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
 * 
 * This happens in two steps:
 *  - validate the csrf token in the request body and in the cookie
 *
 *  - verify that the json token in the request body is valid,
 *    uses google auth library to validate,
 *    additional validation on the payload can be done at this step
 *    (e.g. verifying that the account has an account, checking if its from @stuy.edu)
 */

// Check csrf token 
export async function verifyCsrfToken(g_csrf_body, g_csrf_token) {
    // Check if double cookies are working
    if (g_csrf_token === undefined)
        throw new Error('No CSRF token in Cookie');

    if (g_csrf_body === undefined)
        throw new Error('No CSRF token in body');

    if (g_csrf_body != g_csrf_token)
        throw new Error('Failed to verify double CSRF tokens');

    return true;
}

// check sign in jwt
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET
);

export async function verifySignInToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    // payload contains important stuff like account 
    // email, name, subject id, etc.
    // test it out here = https://oauth2.googleapis.com/tokeninfo?id_token=<token>
    return ticket.getPayload();
}
