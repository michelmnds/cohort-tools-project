const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = require("express").Router();

const SALT_ROUNDS = 13;

router.post("/signup", async (req, res, next) => {
  const payload = req.body; // { email, password }
  // Hash the password
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = bcrypt.hashSync(payload.password, salt);
  // Record the user to the DB
  const userToRegister = { email: payload.email, passwordHash };
  try {
    const newUser = await User.create(userToRegister);
    res.status(201).json({ message: "User created", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res, next) => {
  const payload = req.body; // { email, password }
  try {
    const potentialUser = await User.findOne({
      email: payload.email.toLowerCase().trim(),
    });

    if (potentialUser) {
      // User matching the email
      if (bcrypt.compareSync(payload.password, potentialUser.passwordHash)) {
        // Password is correct
        const authToken = jwt.sign(
          {
            userId: potentialUser._id,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );
        res.status(200).json({ authToken: authToken });
      } else {
        // Incorrect password
        res.status(403).json({ message: "Incorrect password" });
      }
    } else {
      // No user matching the email
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  console.log(req.tokenPayload);
  const currentUser = await User.findById(req.tokenPayload.userId);
  res.status(200).json(currentUser);
});

module.exports = router;
