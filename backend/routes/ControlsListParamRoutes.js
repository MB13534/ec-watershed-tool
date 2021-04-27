const express = require('express')
const { checkAccessToken } = require('../middleware/auth.js')
const { ListParametersModel } = require('../models')
const { ListPrioritiesModel } = require('../models')
const { ListThreatsModel } = require('../models')
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Create Express Router
const router = express.Router()

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE))

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
 * GET /api/controls-list-param/parameters
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

module.exports = router
