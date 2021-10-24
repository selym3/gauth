import { Router } from 'express';
var router = Router();

router.get('/', (_req, res) => { 
    res.render('layout', {title:'Home', page:'home'}); 
});

export default router;