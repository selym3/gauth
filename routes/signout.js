import { Router } from 'express';
import { requireAuth, TokenCookie } from '../util/authorization.js';
var router = Router();

/**
 * This endpoint is a simple signout routine that clears a 
 * the cookie that holds the user state and then prompts them to 
 * sign in again.
 */

router.get('/signout', requireAuth(), (_req, res) => { 
    TokenCookie.clear(res);
    res.redirect('/signin');
});

export default router;