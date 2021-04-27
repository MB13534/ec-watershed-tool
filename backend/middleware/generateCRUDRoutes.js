const express = require("express");

/**
 * Generate a CRUD routes for a DB resource
 * Creates a router and creates routes for
 * - retrieving all records
 * - retrieving a single record
 * - creating a new record
 * - updating an existing record
 * Returns the router
 * @param {Object} config - Router configs
 * @param {array} config.middleware - An array of
 * middlewares that should be attached to the router
 * @param {object} config.model - The sequelize DB
 * model that should be used for CRUD operations
 * @param {string} config.ndxField - The name of the
 * @param {object} config.additionalRequests - Any additional endpoints and logic that should be created in addition to the standard CRUD endpoints
 * DB index field
 * @returns {object} returns an Express Router
 */
function generateCRUDRoutes({
  middleware,
  model,
  ndxField,
  additionalRequests = [],
}) {
  const router = express.Router();

  // Attach middleware to ensure that user is authenticated
  middleware.map((mw) => router.use(mw));

  if (additionalRequests.length > 0) {
    additionalRequests.map((request) => {
      const reqType = request.type.toUpperCase();
      if (reqType === "GET") {
        router.get(request.path, request.request);
      }
    });
  }

  /**
   * Endpoint used to retrieve all records
   */
  router.get("/", (req, res, next) => {
    model
      .findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
   * Endpoint used to retrieve a single records
   */
  router.get("/:id", (req, res, next) => {
    model
      .findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
   * Endpoint used to create a new records
   */
  router.post("/", (req, res, next) => {
    model
      .create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
   * Endpoint used to update a record records
   */
  router.put("/:id", (req, res, next) => {
    const config = {
      where: {},
      returning: true,
    };
    config.where[ndxField] = req.params.id;
    model
      .update(req.body, config)
      .then((data) => {
        res.json(data[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  });

  return router;
}

module.exports = {
  generateCRUDRoutes,
};
