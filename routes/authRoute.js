const { AuthController } = require("../controller/authController");
const router = require("express").Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     description: Sign up a new user with the provided credentials.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userType:
 *                 type: string
 *                 description: User type of the user.
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the user password.
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad request if validation fails.
 */
router.post("/signup", AuthController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *     responses:
 *       200:
 *         description: Successful login and returns authentication token.
 *       401:
 *         description: Unauthorized if credentials are invalid.
 */
router.post("/login", AuthController.login);

module.exports = router;
