const express = require("express");
const { checkAccessToken } = require("../middleware/auth.js");
const { Layers, ParcelLayers, StreamLayers } = require("../layers/Layers");
// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
//router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/layers
 */
router.get("/layers", (req, res, next) => {
  res.json(Layers);
});

/**
 * GET /api/layers/parcels
 */
router.get("/layers/parcels", (req, res, next) => {
  res.json(ParcelLayers);
});

/**
 * GET /api/layers/streams
 */
router.get("/layers/streams", (req, res, next) => {
  res.json(StreamLayers);
});

module.exports = router;
