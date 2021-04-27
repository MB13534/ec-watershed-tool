const {
      checkAccessToken,
      checkPermission,
    } = require("../../middleware/auth.js");
    const { generateRoutes } = require("../../middleware/generateRoutes.js");
    const { Test } = require("../../models");

    const router = generateRoutes({
      middleware: [
        checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE),
      ],
      model: Test,
      ndxField: "POPULATE_ME",
    });

    module.exports = router;