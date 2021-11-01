import { Router } from 'express';
var router = Router();

import { verifySignInToken, verifyCsrfToken } from '../util/authentication.js'

/**
 * Google sign in will send a request to this endpoint 
 * that contains a body with a csrf token and a JWT credential.
 * A csrf token is also placed in the cookies. 
 * 
 * If the google sign in attempt passes authentication,
 *  
 */
router.post('/login', async (req, res) => { 
    
    try {

        // AUTHENTICATE GOOGLE SIGN IN ATTEMPT // 

        // throw an error if csrf token in body
        // doesn't match csrf token in cookie 
        await verifyCsrfToken(
            req.body['g_csrf_token'], 
            req.cookies['g_csrf_token']
        );
        
        let usr = await verifySignInToken(req.body['credential']);

        // CREATE A JWT FOR THE USER //

        console.log(usr);
        res.end('OK');
    } catch (err) {
        console.error(err);
        res.end('failed');
    }

});

export default router;