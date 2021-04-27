const express = require("express");
const faker = require("faker");
const { checkAccessToken, checkPermission } = require("../middleware/auth.js");

const { ExampleTable } = require("../models");

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/example/example-table
 */
router.get("/example-table", (req, res, next) => {
  ExampleTable.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /api/example/contacts
 */
router.get("/contacts", (req, res, next) => {
  let recs = [];
  for (let i = 0; i < 100; i++) {
    recs.push({
      contact_ndx: i,
      contact_name: faker.name.firstName() + " " + faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      address: `${faker.address.streetAddress()}`,
      city: `${faker.address.city()}`,
      state: `${faker.address.stateAbbr()}`,
    });
  }
  res.json(recs);
});

/**
 * POST /api/example/contacts
 */
router.post("/contacts", (req, res, next) => {
  res.json({
    contact_ndx: i,
    contact_name: faker.name.firstName() + " " + faker.name.lastName(),
    phone: faker.phone.phoneNumber(),
    address: `${faker.address.streetAddress()}`,
    city: `${faker.address.city()}`,
    state: `${faker.address.stateAbbr()}`,
  });
});

/**
 * PUT /api/example/contacts/:id
 */
router.put("/contacts/:id", (req, res, next) => {
  res.json({
    contact_ndx: i,
    contact_name: faker.name.firstName() + " " + faker.name.lastName(),
    phone: faker.phone.phoneNumber(),
    address: `${faker.address.streetAddress()}`,
    city: `${faker.address.city()}`,
    state: `${faker.address.stateAbbr()}`,
  });
});

/**
 * GET /api/example/contacts/assoc/contact-groups
 */
router.get("/contacts/assoc/contact-groups", (req, res, next) => {
  let recs = [];
  for (let i = 0; i < 100; i++) {
    recs.push({
      contact_ndx: i,
      contact_name: faker.name.firstName() + " " + faker.name.lastName(),
      group_ndx: Math.ceil(Math.random() * 15),
      group_name: faker.company.companyName(),
    });
    recs.push({
      contact_ndx: i,
      contact_name: faker.name.firstName() + " " + faker.name.lastName(),
      group_ndx: Math.ceil(Math.random() * 15),
      group_name: faker.company.companyName(),
    });
    recs.push({
      contact_ndx: i,
      contact_name: faker.name.firstName() + " " + faker.name.lastName(),
      group_ndx: Math.ceil(Math.random() * 15),
      group_name: faker.company.companyName(),
    });
  }
  res.json(recs);
});

/**
 * GET /api/example/orders
 */
router.get("/orders", (req, res, next) => {
  let recs = [];
  for (let i = 0; i < 100; i++) {
    recs.push({
      order_ndx: i,
      order: faker.random.uuid(),
      customer_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      product: faker.commerce.productName(),
      price: faker.commerce.price(),
    });
  }
  res.json(recs);
});

/**
 * POST /api/example/orders
 */
router.post("/orders", (req, res, next) => {
  res.json({
    order_ndx: i,
    order: faker.random.uuid(),
    customer_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    product: faker.commerce.productName(),
    price: faker.commerce.price(),
  });
});

/**
 * PUT /api/example/orders/:id
 */
router.put("/orders/:id", (req, res, next) => {
  res.json({
    order_ndx: i,
    order: faker.random.uuid(),
    customer_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    product: faker.commerce.productName(),
    price: faker.commerce.price(),
  });
});

/**
 * GET /api/example/contact-groups
 */
router.get("/contact-groups", (req, res, next) => {
  let recs = [];
  for (let i = 0; i < 100; i++) {
    recs.push({
      group_ndx: i,
      group_name: faker.company.companyName(),
    });
  }
  res.json(recs);
});

/**
 * POST /api/example/contact-groups
 */
router.post("/contact-groups", (req, res, next) => {
  res.json({
    group_ndx: i,
    group_name: faker.company.companyName(),
  });
});

/**
 * PUT /api/example/contact-groups/:id
 */
router.put("/contact-groups/:id", (req, res, next) => {
  res.json({
    group_ndx: i,
    group_name: faker.company.companyName(),
  });
});

module.exports = router;
