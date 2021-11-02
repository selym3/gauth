import { Router } from 'express';
var router = Router();

import { verifySignInToken, verifyCsrfToken } from '../util/authentication.js'
import { getAccessToken, requireUnauth, TokenCookie } from '../util/authorization.js';

/**
 * This is the page users will visit when they need need to sign in.
 * It shows a google sign in button that will eventually send a post request
 * to /signin (endpoint below)
 * 
 * It uses middleware to make sure you cannot sign in while already signed in.
 */
router.get('/signin', requireUnauth(), (req, res) => {
    res.render('layout', {
        page: 'signin',
        title: 'Sign In',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_LOGIN_ENDPOINT: process.env.GOOGLE_LOGIN_ENDPOINT
    });
});

/**
 * Google sign in will send a request to this endpoint 
 * that contains a body with a csrf token and a JWT credential.
 * A csrf token is also placed in the cookies. 
 * 
 * If the google sign in attempt passes authentication,
 *  
 */
router.post('/signin', async (req, res) => {

    try {

        // AUTHENTICATE GOOGLE SIGN IN ATTEMPT // 

        // throw an error if csrf token in body
        // doesn't match csrf token in cookie 
        await verifyCsrfToken(
            req.body['g_csrf_token'],
            req.cookies['g_csrf_token']
        );

        let usr = await verifySignInToken(req.body['credential']);
        console.log(usr);

        // CREATE + STORE A JWT FOR THE USER //

        let jwt = getAccessToken(
            // this object will be encoded in the jwt and will
            // appear in each request from the browser.
            // NOTE: in most apps, one of these values refers to some entry in a database,
            // so that not everything will be stored in the jwt
            {
                sub: usr.sub,
                name: usr.name,
                picture: usr.picture
            }
        );
        TokenCookie.set(res, jwt);
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.redirect('/signin');
    }

});

export default router;