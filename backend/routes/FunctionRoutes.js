const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { sequelize } = require('../models');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/functions
 */
router.get('/process-control-selections', (req, res, next) => {
  sequelize.query('SELECT web.intersect_user_geometry();')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
