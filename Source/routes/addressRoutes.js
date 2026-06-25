const express = require("express");
const router = express.Router();

const {
    createAddress,
    getAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
} = require("../controllers/addressController");

const authenticate = require("../middleware/auth");

router.post(
    "/",
    authenticate,
    createAddress
);

router.get(
    "/",
    authenticate,
    getAddresses
);

router.get(
    "/:id",
    authenticate,
    getAddressById
);

router.put(
    "/:id",
    authenticate,
    updateAddress
);

router.delete(
    "/:id",
    authenticate,
    deleteAddress
);

module.exports = router;