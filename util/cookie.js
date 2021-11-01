/**
 * Cookies are necessary for storing the JWT for the client
 * because HTTP is a stateless protocol. An additional mediary is
 * necessary for adding user state to an HTTP server.
 * 
 * This is a utility class for common operations with cookies
 * 
 * Note about HTTP Cookies:
 * 
 *  - cookie values come in through a http request from the browser
 *  
 *  - an http server will mutate cookies through Set-Cookie headers in 
 *    an http RESPONSE
 *  
 *  - this response goes back to the browser (or any client) and the browser
 *    will update its storage of cookies appropiately    
 * 
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */

export default class Cookie {
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }

    isSigned() {
        return this.options.isSigned;
    }

    get(req) {
        if (this.isSigned())
            return req.cookies[this.name];
        else
            return req.signedCookies[this.name];
    }

    set(res, value) {
        res.cookie(this.name, value, this.options);
    }

    clear(res) {
        res.clearCookie(
            this.name, 

            // this is a little hacky but some options need to be
            // passed back so the browser can clear the right cookie
            ...this.options
        );
    }
}