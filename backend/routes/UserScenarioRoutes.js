const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { UserScenarioModel } = require('../models');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// GET /api/user-scenario
// Route for returning all user scenarios
router.get(
  '/',
  (req, res, next) => {
    UserScenarioModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// GET /api/user-scenario/:ndx
// Route for retrieving a single user scenario
router.get(
  '/:ndx',
  (req, res, next) => {
    UserScenarioModel.findByPk(req.params.ndx)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/user-scenario
// Route for creating a new user scenario
router.post(
  '/',
  (req, res, next) => {
    const body = req.body;
    body.auth0_sub = req.user.sub;

    UserScenarioModel.create(body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/user-scenario/:ndx
// Route for updating an existing user scenario
router.put(
  '/:ndx',
  (req, res, next) => {
    const body = req.body;
    body.auth0_sub = req.user.sub;
    UserScenarioModel.update(body, {
      where: {
        auth0_sub: req.user.sub,
        user_scenario_ndx: req.params.ndx,
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

// DELETE /api/user-scenario/:ndx
// Route for deleting an existing user scenario
router.delete(
  '/:ndx',
  (req, res, next) => {
    UserScenarioModel.destroy({
      where: {
        auth0_sub: req.user.sub,
        user_scenario_ndx: req.params.ndx,
      },
    })
      .then((data) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
