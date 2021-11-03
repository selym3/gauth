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
    res.render(
        'layout', 
        
        // Looking at pages/home.ejs, it may seem that sub and name 
        // are missing from the data here, but they are actually stored 
        // in res.locals (see getMiddleware(...) in util/authorization.js), which is 
        // automatically passed in to the EJS template

        {
            title:'Home', 
            page:'home',
            css: ['stylesheets/home.css']
        }
    ); 
});

export default router;