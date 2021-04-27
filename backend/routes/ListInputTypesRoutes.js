const express = require('express');
const {
  checkAccessToken,
  checkPermission,
} = require('../middleware/auth.js');
const { ListInputTypesModel } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// GET /api/input-types
// Route for returning all input types
router.get(
  '/',
  checkPermission(['read:database-management']),
  (req, res, next) => {
    ListInputTypesModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// GET /api/input-types/all
// Route for returning all input types
router.get(
  '/all',
  checkPermission(['read:database-management']),
  (req, res, next) => {
    ListInputTypesModel.unscoped().findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// GET /api/input-types/:id
// Route for retrieving a single input type
router.get(
  '/:id',
  checkPermission(['read:database-management']),
  (req, res, next) => {
    ListInputTypesModel.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/input-types
// Route for creating a new input type
router.post(
  '/',
  checkPermission(['read:database-management', 'write:database-management']),
  (req, res, next) => {
    ListInputTypesModel.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/input-types/:id
// Route for updating an existing input type
router.put(
  '/:id',
  checkPermission(['read:database-management', 'write:database-management']),
  (req, res, next) => {
    ListInputTypesModel.update(req.body, {
      where: {
        input_type_ndx: req.params.id,
      },
      returning: true,
    })
      .then((data) => {
        res.json(data[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
