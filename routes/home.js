import { Router } from 'express';
import { requireAuth } from '../util/authorization.js';
var router = Router();

/**
 * This endpoint responds to any requests with html 
 * that is generated from an ejs layout.
 * 
 * The layout (res.render('layout', ...)) takes in the 
 * name of another ejs ({page: ...}) file as a parameter and pastes it in. All
 * the ejs files get access to the same options that are passed in.
 * 
 * This endpoint uses a middleware that requires the user to be signed in.
 */

router.get('/', requireAuth(), (_req, res) => { 
    res.render('layout', {
        title:'Home', 
        page:'home',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, 
        GOOGLE_LOGIN_ENDPOINT: process.env.GOOGLE_LOGIN_ENDPOINT
    }); 
});

export default router;