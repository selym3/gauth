/**
 * This file is responsible for authorizing the state 
 * of a user on each request.
 * 
 * The state of user starts when they successfully sign in 
 * with google and (should) end when they log out or their 
 * sessions expires.
 * 
 * The full authorization process happens in a few steps:
 *    (note the difference between the jwt itself and the cookie that carries the jwt)
 *    (also note there are different methods for storing the JWTs but the JWT logic is usually the same)
 * 
 *  - JWT is initially created after sign in, 
 *    it contains some data from the payload and expires in some small time frame (15min-1hour).
 *    After this expiration date, the JWT is regenrated ( see step below )
 *    
 *    The jwt is stored in a cookie by the browser. The cookie has a larger time frame (7days-1fortnight), 
 *    after which the JWT is not regenerated (see last step)
 *   
 *  - On each request, the jwt cookie is checked.
 *    
 *      If the cookie is empty, the request is not processed, page may be redirected
 *      If malformed, the request also fails. 
 *      If expired, a new jwt is generated and request is processed
 *      If totally valid, request is processed
 * 
 *  - After, the cookie that holds the JWT is expired, or the user signs out (clearing that cookie)
 *    their session has expired
 * 
 */

// generating the jwt itself // 
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
        maxAge: 604800000
    }
);
