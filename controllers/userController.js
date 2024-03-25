const User = require("./../models/User");
const CatchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwtDecode = require("jwt-decode"); // Import jwtDecode module

// Function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Middleware to get all users
exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Middleware to update user's information
exports.updateMe = CatchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  // Filter the body to update only allowed fields
  const filteredBody = filterObj(req.body, "firstName", "lastName", "email");
  // Update user information
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

// Middleware to deactivate user's account
exports.deleteMe = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Middleware to create a user (dummy response)
exports.createUser = (req, res) => {
  res.status(200).json({
    status: "posting database",
    data: req.body,
  });
};

// Middleware to get a user by ID
exports.getUser = CatchAsync(async (req, res) => {
  const userId = req.params.id; // Retrieve the user ID from the request parameters
  // Query the database for the user information using the user ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Send the user information as a response
  res.status(200).json({ user });
});

exports.updateUser = CatchAsync(async (req, res) => {
  const { userId, days } = req.body; // Retrieve userId and trip data from request body

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log(days);
  user.days.push(days);

  // Save the updated user
  await user.save();

  return res
    .status(200)
    .json({ message: "Trip data saved successfully", user });
});

// Middleware to delete a user (dummy response)
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "posting database",
  });
};

// Middleware to get a user using JWT token
exports.user = CatchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

// Middleware to save user's plan data
exports.savePlan = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  const { days } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the "days" array
  user.days = days;

  // Save the updated user
  await user.save();

  return res
    .status(200)
    .json({ message: "Days data saved successfully", user });
});
