const { nanoid } = require('nanoid');
const URL = require('../models/url.model');

exports.createShortUrl = async (req, res) => {
    console.log("API HIT 🚀");

    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(6);

    const newEntry = await URL.create({
        originalUrl,
        shortId
    });

    res.json({
        shortUrl: `http://localhost:3000/${shortId}`
    });
};

exports.redirectUrl = async (req, res) => {
    const { shortId } = req.params;

    const entry = await URL.findOne({ shortId });

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    entry.clicks++;
    await entry.save();

    res.redirect(entry.originalUrl);
};