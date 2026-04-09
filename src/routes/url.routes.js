const express = require('express');
const router = express.Router();

const { createShortUrl } = require('../controllers/url.controller');

router.post('/shorten', createShortUrl);

router.get('/test', (req, res) => {
    res.send("TEST ROUTE WORKING ✅");
});

const { redirectUrl } = require('../controllers/url.controller');

router.get('/:shortId', redirectUrl);

module.exports = router;