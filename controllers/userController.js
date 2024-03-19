const User = require("./../models/User");
const CatchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = CatchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(new AppError("this route is not for password updates.", 400));
  }

  const filteredBody = filterObj(req.body, "firstName", "lastName", "email");
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

exports.deleteMe = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(200).json({
    status: "posting database",
    data: req.body,
  });
};
exports.getUser = (req, res) => {
  res.status(200).json({
    status: req.query,
    stat: "ok",
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "posting database",
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "posting database",
  });
};
