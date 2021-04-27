const express = require('express');
const { checkAccessToken } = require('../middleware/auth.js');
const {
  ResultsModel,
  ResultsDetailsModel,
  ResultsDetailsAqVulnModel,
  ResultsDetailsLandUseModel,
  ResultsDetailsParcelsModel,
} = require('../models');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/results
 */
router.get('/', (req, res, next) => {
  ResultsModel.findAll({
    where: {
      userid: req.user.sub,
    },
  })
    .then((resultsData) => {
      ResultsDetailsModel.findAll({
        where: {
          userid: req.user.sub,
        },
      })
        .then((resultsDetailsData) => {
          ResultsDetailsAqVulnModel.findAll({
            where: {
              userid: req.user.sub,
            },
          })
            .then((resultsDetailsAqVulnData) => {
              ResultsDetailsLandUseModel.findAll({
                where: {
                  userid: req.user.sub,
                },
              })
                .then((resultsDetailsLandUseData) => {
                  ResultsDetailsParcelsModel.findAll({
                    where: {
                      userid: req.user.sub,
                    },
                  })
                    .then((resultsDetailsParcelsData) => {
                      res.json({
                        data: resultsData,
                        detailsData: resultsDetailsData,
                        detailsAqVulnData: resultsDetailsAqVulnData,
                        detailsLandUseData: resultsDetailsLandUseData,
                        detailsParcelsData: resultsDetailsParcelsData,
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
