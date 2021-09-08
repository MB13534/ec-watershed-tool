const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { DynamicFinalForPortalPointsModel } = require('../models');
const { DynamicFinalForPortalTableModel } = require('../models');
const { DynamicFinalForPortalTimeSeriesModel } = require('../models');
const { DynamicFinalForPortalAnnualModel } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/monitoring-point/
 */
router.post('/', (req, res, next) => {
  const where = {};

  where.parameter_index = {
    [Op.in]: req.body.parameters,
  };

  DynamicFinalForPortalPointsModel.findAll({ where: where })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * POST /api/monitoring-point/table
 */
router.post('/table/:id', (req, res, next) => {
  const where = {};

  where.location_index = req.params.id;
  where.parameter_index = {
    [Op.in]: req.body.parameters,
  };

  DynamicFinalForPortalTableModel.findAll({
    where: where,
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * POST /api/monitoring-point/time-series-line
 */
router.post('/time-series-line/:id', (req, res, next) => {
  const where = {};

  where.location_index = req.params.id;
  where.parameter_index = {
    [Op.in]: req.body.parameters,
  };

  DynamicFinalForPortalTimeSeriesModel.findAll({
    where: where,
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * POST /api/monitoring-point/time-series-bar
 */
router.post('/time-series-bar/:id', (req, res, next) => {
  const where = {};

  where.location_index = req.params.id;
  where.parameter_index = {
    [Op.in]: req.body.parameters,
  };

  DynamicFinalForPortalAnnualModel.findAll({
    where: where,
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
