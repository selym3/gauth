import { Router } from 'express';
var router = Router();

router.post('/login', (ereq, res) => { 
    console.log(req.body);
    res.status(200).end("OK");
});

export default router;