const { Sequelize } = require('sequelize');
const user = require('../db/models/user');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');

class UserController {
  static getAllUser = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
      where: {
        userType: {
          [Sequelize.Op.ne]: '0',
        },
      },
      attributes: {
        exclude: ['password'],
      },
    });

    return success(res, users, 'User found');
  });
}

module.exports = { UserController };
