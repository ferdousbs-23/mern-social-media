const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.desc = !isEmpty(data.desc) ? data.desc : "";
// Desc checks
  if (Validator.isEmpty(data.desc)) {
    errors.desc = "Desc field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};