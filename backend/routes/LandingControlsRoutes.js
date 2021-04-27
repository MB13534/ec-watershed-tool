const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const { LandingControlsModel, UserLastActiveModel } = require('../models');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/landing-controls
 */
router.post('/', (req, res, next) => {
  let data = req.body;

  data = data.map(row => ({
    option_ndx: row.option_ndx,
    input_type_ndx: row.input_type_ndx,
    wt: row.weight,
    userid: req.user.sub,
  }));

  UserLastActiveModel.destroy({ where: {}, truncate: true })
    .then(() => {
      UserLastActiveModel.upsert({ auth0_sub: req.user.sub })
        .then(() => {
          LandingControlsModel.destroy({ where: {userid: req.user.sub}})
            .then(() => {
              LandingControlsModel.bulkCreate(data)
                .then((data) => {
                  res.json(data);
                })
                .catch((err) => {
                  next(err);
                });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
