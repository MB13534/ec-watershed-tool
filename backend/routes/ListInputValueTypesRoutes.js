const express = require('express');
const {
  checkAccessToken,
  checkPermission,
} = require('../middleware/auth.js');
const { ListInputValueTypesModel } = require('../models');
const Sequelize = require('sequelize');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// GET /api/input-types
// Route for returning all input value types
router.get(
  '/',
  checkPermission(['read:database-management']),
  (req, res, next) => {
    ListInputValueTypesModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
