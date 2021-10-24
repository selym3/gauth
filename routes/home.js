import { Router } from 'express';
var router = Router();

router.get('/', (_req, res) => { 
    res.render('layout', {
        title:'Home', 
        page:'home',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, 
        GOOGLE_LOGIN_ENDPOINT: process.env.GOOGLE_LOGIN_ENDPOINT
    }); 
});

export default router;