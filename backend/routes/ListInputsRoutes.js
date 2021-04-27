const express = require("express");
const {
  checkAccessToken,
  checkPermission,
} = require("../middleware/auth.js");
const { ListInputsModel } = require("../models");

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// GET /api/inputs
// Route for returning all inputs
router.get(
  "/",
  checkPermission(["read:database-management"]),
  (req, res, next) => {
    ListInputsModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// GET /api/inputs/:id
// Route for retrieving a single input
router.get(
  "/:id",
  checkPermission(["read:database-management"]),
  (req, res, next) => {
    ListInputsModel.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// POST /api/inputs
// Route for creating a new input
router.post(
  "/",
  checkPermission(["read:database-management", "write:database-management"]),
  (req, res, next) => {
    ListInputsModel.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// PUT /api/inputs/:id
// Route for updating an existing input
router.put(
  "/:id",
  checkPermission(["read:database-management", "write:database-management"]),
  (req, res, next) => {
    ListInputsModel.update(req.body, {
      where: {
        input_ndx: req.params.id,
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

// DELETE /api/inputs/:id
// Route for deleting an existing input
router.delete(
  "/:id",
  checkPermission(["read:database-management", "write:database-management"]),
  (req, res, next) => {
    ListInputsModel.destroy({
      where: {
        input_ndx: req.params.id,
      }
    })
      .then((data) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
