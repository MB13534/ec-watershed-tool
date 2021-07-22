const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { UserGeometryModel, GisUserIntersectLandUseModel, GisUserIntersectStationsModel, GisUserIntersectParcelsModel } = require('../models');
const { sequelize } = require("../models/index.js");

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

/**
 * GET /api/user-geometry/landuse
 */
router.get('/landuse', (req, res, next) => {
  GisUserIntersectLandUseModel.findAll({
    where: {
      userid: req.user.sub,
    },
    order: [
      [ sequelize.cast(sequelize.fn('replace', sequelize.col('pct_of_total'), '%', ''), 'REAL') , 'DESC' ]
    ]
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /api/user-geometry/stations
 */
router.get('/stations', (req, res, next) => {
  GisUserIntersectStationsModel.findAll({
    where: {
      userid: req.user.sub,
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
 * GET /api/user-geometry/parcels
 */
router.get('/parcels', (req, res, next) => {
  GisUserIntersectParcelsModel.findAll({
    where: {
      userid: req.user.sub,
    },
    order: [['parcel_id', 'ASC']],
    limit: 100
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
