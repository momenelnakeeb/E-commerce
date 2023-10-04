const { check } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../../users/model/users.model");
const validatorMiddleware = require("../../../common/middleware/validator.middleware");

// const { check } = require("express-validator");

// Define a custom postal code validator function
const isPostalCodeValid = (value) => {
  // Define a regular expression pattern for a 4-digit postal code
  const postalCodePattern = /^\d{4}$/;

  // Test if the value matches the pattern
  return postalCodePattern.test(value);
};

// Use the custom validator in your validation chain
exports.addUserAddressValidator = [
  check("alias").notEmpty().withMessage("Address alias is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("details")
    .notEmpty()
    .withMessage("Address details is required")
    .isLength({ max: 320 })
    .withMessage("Too long address details"),
  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid mobile number"),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .custom(isPostalCodeValid) // Use the custom postal code validator
    .withMessage("Invalid postal code"),
  validatorMiddleware,
];

exports.removeUserAddressValidator = [
  check("addressId")
    .notEmpty()
    .withMessage("Address id is required")
    .isString() // Ensure that addressId is a string
    .withMessage("Invalid address id")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        throw new Error("User not found");
      }

      // Continue with your existing code to check if the addressId exists in user's addresses
      const addressExists = user.addresses.some((address) =>
        address._id.equals(value)
      );

      if (!addressExists) {
        throw new Error("Address not found");
      }
    }),
  validatorMiddleware,
];
