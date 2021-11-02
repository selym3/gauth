/**
 * This file is responsible for authorizing the state 
 * of a user on each request.
 * 
 * The state of user starts when they successfully sign in 
 * with google and should end when they log out or their 
 * sessions expires.
 * 
 * The full authorization process happens in a few steps:
 *    (note the difference between the jwt itself and the cookie that carries the jwt)
 *    (also note there are different methods for storing the JWTs but the JWT logic is usually the same)
 * 
 *  1) JWT is initially created after sign in, 
 * 
 *      it contains some data from the google sign in payload and expires in some small time frame (15min-1hour).
 *      After this expiration date, the JWT is regenrated ( see step below )
 *    
 *      The jwt is stored in a cookie by the browser. The cookie has a larger time frame (7days-1fortnight), 
 *      after which the JWT is not regenerated and the session expires (see last step)
 *   
 *  2)  On each request, the jwt cookie is checked.
 *    
 *       If the cookie is empty, the request is not processed, page may be redirected
 *       If jwt in cookie malformed, the request also fails. 
 *       If it's expired, a new jwt is generated in the cookie and request is processed
 *       If it's totally valid, request is processed
 * 
 *  3) After, the cookie that holds the JWT is expired, or the user signs out (clearing that cookie)
 *     their session has expired
 * 
 */

/**
 * generate a jwt 
 */
 
import jwt from 'jsonwebtoken'

const SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_OPTIONS = {
    "expiresIn": "15m"
};

export function getAccessToken(payload) {
    return jwt.sign(
        payload,
        SECRET,
        ACCESS_TOKEN_OPTIONS
    );
}

/**
 * store the jwt in a cookie 
 */

// cookie that holds the jwt //
import Cookie from '../util/cookie.js'

export const TokenCookie = new Cookie(
    'jid',

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV !== "development",
        path: '/',
        maxAge: 604800000 // this might be 7 days
    }
);

/**
 * validate a jwt
 */

// checks if an access token is in a valid state ( assuming it exists )
// (usually means checking if expired or data was modified)

function verifyAccessToken(accessToken) {
    return jwt.verify(
        accessToken,
        SECRET,
        ACCESS_TOKEN_OPTIONS
    );
}

// checks if a request is valid, will check for existence
// of jwt and regenerate if expired. Returns either the parsed
// payload of the jwt or undefined

function verifyRequest(req, res) {
    const token = TokenCookie.get(req);

    try {
        return verifyAccessToken(token);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.log('Token expired, regenerating');

            // Get the expired payload
            let rawPayload = jwt.decode(token);

            // Remove timestamp in payload (this is kinda hacky)
            delete rawPayload.iat;
            delete rawPayload.exp;

            // Update cookie (generates new payload)
            const newToken = getAccessToken(rawPayload)
            TokenCookie.set(res, newToken);

            // Retrieve most up-to-date payload
            rawPayload = jwt.decode(newToken);
            return rawPayload;
        }

        return undefined;
    }
}

// express middleware that implements step 2,
// which checks if the jwt is present and if it's valid

function getMiddleware(callbacks) {
    return (req, res, next) => {
        let payload = verifyRequest(req, res);
        if (payload) {

            // This stores data about the user in an object in response
            // to avoid having to reread from the cookie on every function 
            // that is run on a request. 
            //
            // This would be a good place to perform some data-loading operation
            // like loading a users data based on their id in the jwt

            res.locals.authed = true;
            
            res.locals = {
                // this is a lazy way to concatenate two dictionaries in js
                // i do this just to leave the code here really general 
                // (e.g. will work if what the payload contains changes)
                ...payload, 
                ...res.locals
            };
            
            callbacks.onAuthorized(req, res, next);
        } else {
            callbacks.onFailure(req, res, next);
        }
    };
}

// this middleware requires the jwt to be valid to be 
// allow pass through to the endpoint, otherwise redirects to sign in

export function requireAuth() {
    return getMiddleware({
        onAuthorized: (req, res, next) => next(),
        onFailure: (req, res, next) => res.redirect('/signin')
    });
}

// this middleware requires the user to be signed out,
// will redirect back to ... 

export function requireUnauth() {
    return getMiddleware({
        onAuthorized: (req, res, next) => res.redirect('/'),
        onFailure: (req, res, next) => next()
    });
}
