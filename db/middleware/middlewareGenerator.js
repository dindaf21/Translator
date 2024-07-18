const { AuthController } = require("../../controller/authController");

const authentication = AuthController.authentication;

const restrictTo = (...userTypes) => {
  return AuthController.restrictTo(...userTypes);
};

const middleware = (userTypes) => {
  const middlewares = [authentication];
  if (userTypes && userTypes.length) {
    middlewares.push(restrictTo(...userTypes));
  }
  return middlewares;
};

module.exports = { middleware, authentication, restrictTo };
