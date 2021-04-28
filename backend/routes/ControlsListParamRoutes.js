const express = require('express')
const { checkAccessToken } = require('../middleware/auth.js')
const { ListParametersModel } = require('../models')
const { ListPrioritiesModel } = require('../models')
const { ListThreatsModel } = require('../models')
const { SeasonalAnalysisStartDateModel } = require('../models')
const { SeasonalAnalysisEndDateModel } = require('../models')
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Create Express Router
const router = express.Router()

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE))

/**
 * GET /api/controls-list-param/startDate
 */
router.get('/startDate', (req, res, next) => {
  SeasonalAnalysisStartDateModel.findAll({})
    .then((data) => {
      res.json(data[0].analysis_start_date)
    })
    .catch((err) => {
      next(err)
    })
})

/**
 * GET /api/controls-list-param/endDate
 */
router.get('/endDate', (req, res, next) => {
  SeasonalAnalysisEndDateModel.findAll({})
    .then((data) => {
      res.json(data[0].analysis_end_date)
    })
    .catch((err) => {
      next(err)
    })
})

/**
 * GET /api/controls-list-param/priorities
 */
router.get('/priorities', (req, res, next) => {
  ListPrioritiesModel.findAll({})
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      next(err)
    })
})

/**
 * GET /api/controls-list-param/threats
 */
router.get('/threats', (req, res, next) => {
  ListThreatsModel.findAll({})
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      next(err)
    })
})

/**
 * POST /api/controls-list-param/parameters
 */
router.post('/parameters', (req, res, next) => {
  const data = req.body;
  const where = {};

  if (data.priorities) {
    where.priority_index = {
      [Op.in]: data.priorities,
    };
  }

  if (data.threats) {
    where.risk_index = {
      [Op.in]: data.threats,
    };
  }

  if (!data.priorities && !data.threats) {
    res.json([]);
  } else {
    ListParametersModel.findAll({ where })
      .then((data) => {
        let newData = [];
        const addedIndexes = [];

        data.forEach(x => {
          if (addedIndexes.indexOf(x.parameter_index) === -1) {
            newData.push({
              parameter_index: x.parameter_index,
              parameter_abbrev: x.parameter_abbrev,
            });
            addedIndexes.push(x.parameter_index);
          }
        });

        res.json(newData)
      })
      .catch((err) => {
        next(err)
      })
  }
})

/**
 * POST /api/controls-list-param/submit
 */
router.post('/submit', (req, res, next) => {
  const data = req.body;

  if (data.startDate !== '' && data.endDate !== '') {
    SeasonalAnalysisStartDateModel.update({analysis_start_date: data.startDate}, {where: {}})
      .then(() => {
        SeasonalAnalysisEndDateModel.update({analysis_end_date: data.endDate}, {where: {}})
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.sendStatus(500);
  }
})

module.exports = router
