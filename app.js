require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const globalErrorHandler = require("./controller/errorController");
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const { swaggerUi, swaggerSpec } = require('./utils/swagger'); // Import swagger utils

const app = express();

app.use(express.json());

// Use the main router for all routes
const mainRouter = require('./routes/index');
app.use('/api/v1', mainRouter);

// Set up Swagger UI
app.use('/api/v1/docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

// Handle unknown routes
app.use(
  '*',
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
