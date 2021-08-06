const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { DynamicFinalForPortalPointsModel } = require('../models');
const {
  ListUsgsGradientModel,
  WaterMonthsList,
  WaterYearsList,
  ListUsgsHydrographModel,
  ListUsgsTableStatsModel,
  ListUsgsTableStatsInfoModel,
} = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * POST /api/usgs/gradient/
 */
router.post('/gradient', (req, res, next) => {
  ListUsgsGradientModel.findAll({
    where: {
      wateryear: req.body.properties.year,
      watermonth: req.body.properties.endMonth,
    },
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * POST /api/usgs/hydrograph/
 */
router.post('/hydrograph', (req, res, next) => {
  ListUsgsHydrographModel.findAll({
    where: {
      wateryear: req.body.properties.year,
      watermonth: { [Op.between]: [req.body.properties.startMonth, req.body.properties.endMonth] },
      station_ndx: req.body.properties.station_ndx,
    },
    order: [['waterdayofyear', 'ASC']],
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * POST /api/usgs/tablestats-data/
 */
router.post('/tablestats-data', (req, res, next) => {
  ListUsgsTableStatsModel.findAll({
    where: {
      wateryear: req.body.properties.year,
      watermonth: req.body.properties.endMonth,
      station_ndx: req.body.properties.station_ndx,
    },
    // order: [['waterdayofyear', 'ASC']],
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/usgs/tablestats-info/
 */
router.get('/tablestats-info', (req, res, next) => {
  ListUsgsTableStatsInfoModel.findAll({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/usgs/months
 */
router.get('/months', (req, res, next) => {
  WaterMonthsList.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/usgs/years
 */
router.get('/years', (req, res, next) => {
  WaterYearsList.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/usgs/gradient/:id
 */
router.post('gradient/:name', (req, res, next) => {
  ListUsgsGradientModel.findAll({
    where: {
      station_abrev: req.body.properties.name,
      wateryear: req.body.properties.year,
    },
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
