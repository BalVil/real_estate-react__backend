import express from "express";
import {
  bookVisit,
  cancelBooking,
  createUser,
  currentUser,
  getBookings,
  getFavorites,
  updateFavorites,
} from "../controllers/userController.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/current", jwtCheck, currentUser);
router.post("/visit/:id", jwtCheck, bookVisit);
router.post("/bookings", getBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/favorite/:propertyId", jwtCheck, updateFavorites);
router.post("/favorites", jwtCheck, getFavorites);

export { router as userRoute };
