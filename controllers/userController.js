const User = require("./../models/User");
const CatchAsync = require("./../utils/catchAsync");

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
