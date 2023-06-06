const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

exports.comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};
