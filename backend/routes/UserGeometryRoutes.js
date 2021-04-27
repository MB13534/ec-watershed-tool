const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { UserGeometryModel } = require('../models');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/user-geometry
 */
router.get('/', (req, res, next) => {
  UserGeometryModel.findAll({
    where: {
      auth0_sub: req.user.sub,
    },
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * PUT /api/user-geometry
 * Route for creating/updating a users geometry data
 */
router.put(
  '/',
  (req, res, next) => {
    let features = req.body.features.map(x => ({
      auth0_sub: req.user.sub,
      geometry: x.geometry,
    }));
    UserGeometryModel.destroy({
      where: { auth0_sub: req.user.sub },
    }).then(() => {
      setTimeout(function() {
      UserGeometryModel.bulkCreate(features)
        .then(() => {
          res.json([]);
        })
        .catch((err) => {
          next(err);
        });
      }, Math.random() * 100);
    });
  },
);

module.exports = router;
