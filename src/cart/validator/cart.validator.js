const { check } = require("express-validator");
const Cart = require("../../cart/model/cart.model");
const Product = require("../../products/model/products.model");
const Coupon = require("../../coupons/model/coupons.model");
const validatorMiddleware = require("../../../common/middleware/validator.middleware");

// Validator for adding a product to the cart
exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error("Product not found");
      }
    }),
  check("color")
    .optional()
    .isString()
    .withMessage("Invalid product color")
    .isLength({ max: 32 })
    .withMessage("Too long color"),
  check("size")
    .optional()
    .isString()
    .withMessage("Invalid product size")
    .isLength({ max: 10 })
    .withMessage("Too long product size"),
  validatorMiddleware,
];

// Validator for removing an item from the cart
exports.removeItemFromCartValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item id is required")
    .isMongoId()
    .withMessage("Invalid item id"),
  validatorMiddleware,
];

// Validator for updating the quantity of a specific item in the cart
exports.updateSpecificItemQuantityValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item id is required")
    .isMongoId()
    .withMessage("Invalid item id"),
  check("quantity")
    .notEmpty()
    .withMessage("Item quantity is required")
    .isNumeric()
    .withMessage("Invalid item quantity")
    .custom(async (quantity, { req }) => {
      const { itemId } = req.params;

      // Check if the cart exists for the current user
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        throw new Error("Cart not found");
      }

      // Find the item in the cart's items array by itemId
      const itemToUpdate = cart.items.find((item) => item._id.equals(itemId));

      if (!itemToUpdate) {
        throw new Error("Item not found in the cart");
      }

      // Update the item's quantity in the cart
      itemToUpdate.quantity = parseInt(quantity);

      // Save the updated cart
      await cart.save();
    }),
  validatorMiddleware,
];

// Validator for applying a coupon
exports.applyCouponValidator = [
  check("coupon")
    .notEmpty()
    .withMessage("Coupon name is required")
    .custom(async (value) => {
      const coupon = await Coupon.findOne({ name: value });
      if (!coupon) {
        throw new Error("Invalid or expired coupon");
      }
    }),
  validatorMiddleware,
];
