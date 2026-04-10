const { nanoid } = require('nanoid');
const URL = require('../models/url.model');

exports.createShortUrl = async (req, res) => {
    try {
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
            shortUrl: `${process.env.BASE_URL}/${shortId}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const redisClient = require('../config/redis');

exports.redirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;

        // 🔥 1. Check cache first
        const cachedUrl = await redisClient.get(shortId);

        if (cachedUrl) {
            console.log("Cache HIT ⚡");
            return res.redirect(cachedUrl);
        }

        console.log("Cache MISS 🐢");

        // 2. Fetch from DB
        const entry = await URL.findOne({ shortId });

        if (!entry) {
            return res.status(404).send("URL not found");
        }

        // 3. Store in Redis
        await redisClient.set(shortId, entry.originalUrl);

        // 4. Increase clicks
        entry.clicks++;
        await entry.save();

        res.redirect(entry.originalUrl);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};