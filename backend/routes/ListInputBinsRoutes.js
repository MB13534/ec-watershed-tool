const express = require("express");
const {
  checkAccessToken,
  checkPermission,
} = require("../middleware/auth.js");
const { ListInputBinsModel } = require("../models");

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// GET /api/input-bins
// Route for returning all input bins
router.get(
  "/",
  checkPermission(["read:database-management"]),
  (req, res, next) => {
    ListInputBinsModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// GET /api/input-bins/:id
// Route for retrieving a single input bin
router.get(
  "/:id",
  checkPermission(["read:database-management"]),
  (req, res, next) => {
    ListInputBinsModel.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// POST /api/input-bins
// Route for creating a new input bin
router.post(
  "/",
  checkPermission(["read:database-management", "write:database-management"]),
  (req, res, next) => {
    ListInputBinsModel.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// PUT /api/input-bins/:id
// Route for updating an existing input bin
router.put(
  "/:id",
  checkPermission(["read:database-management", "write:database-management"]),
  (req, res, next) => {
    ListInputBinsModel.update(req.body, {
      where: {
        bin_ndx: req.params.id,
      },
      returning: true,
    })
      .then((data) => {
        res.json(data[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
