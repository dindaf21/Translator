const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class AuthController {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if (!["1", "2"].includes(body.userType)) {
      throw new AppError("Invalid user Type", 400);
    }

    const newUser = await user.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
      return next(new AppError("Failed to create the user", 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = AuthController.generateToken({
      id: result.id,
    });

    return res.status(201).json({
      status: "success",
      data: result,
    });
  });

  static login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = AuthController.generateToken({
      id: result.id,
    });

    return res.json({
      status: "success",
      token,
    });
  });

  static authentication = catchAsync(async (req, res, next) => {
    let idToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
      return next(new AppError('Please login to get access', 401));
    }

    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
      return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
  });

  static restrictTo(...userType) {
    return (req, res, next) => {
      if (!userType.includes(req.user.userType)) {
        return next(
          new AppError("You don't have permission to perform this action", 403)
        );
      }
      return next();
    };
  }
}



module.exports = { AuthController };
