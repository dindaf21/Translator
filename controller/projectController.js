const project = require('../db/models/project');
const user = require('../db/models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');

class ProjectController {
  static createProject = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    const newProject = await project.create({
      title: body.title,
      productImage: body.productImage,
      price: body.price,
      shortDescription: body.shortDescription,
      description: body.description,
      productUrl: body.productUrl,
      category: body.category,
      tags: body.tags,
      createdBy: userId,
    });

    if (!newProject) {
      return next(new AppError('Failed to create the project', 400));
    }

    return success(res, newProject, 'Project created');
  });

  static getAllProject = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await project.findAll({
      include: user,
      where: { createdBy: userId },
    });

    if (!result) {
      return next(new AppError('Data not found', 404));
    }

    return success(res, result, 'Project found');
  });

  static getProjectById = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    const result = await project.findByPk(projectId, {
      include: user,
    });

    if (!result) {
      return next(new AppError('Project ID not found', 404));
    }

    return success(res, result, 'Project found');
  });

  static updateProject = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const body = req.body;

    const result = await project.findOne({
      where: { id: projectId, createdBy: userId },
    });

    if (!result) {
      return next(new AppError('Invalid project id', 400));
    }

    const updateResult = await result.update(body);

    return success(res, updateResult, 'Project updated');
  });

  static deleteProject = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;

    const result = await project.findOne({
      where: { id: projectId, createdBy: userId },
    });

    if (!result) {
      return next(new AppError('Invalid project id', 400));
    }

    await result.destroy();

    return success(res, null, 'Data Successfully Deleted');
  });
}

module.exports = { ProjectController };
