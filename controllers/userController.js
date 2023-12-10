import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email } });
  console.log(userExists);

  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).send({ message: "User registered successfully", user });
  } else {
    res
      .status(409)
      .send({ message: "User is already registered (Email in use)" });
  }
});

export const currentUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    res.status(200).send(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

// to book a visit to a property
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const isBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (!isBooked.bookedVisits.some((visit) => visit.id === id)) {
      await prisma.user.update({
        where: { email },
        data: { bookedVisits: { push: { id, date } } },
      });

      res.send("Your visit is booked successfully");
    } else {
      res
        .status(409)
        .json({ message: "This property is already booked by you" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    res.status(200).send(bookings);
  } catch (error) {
    throw new Error(error.message);
  }
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);

      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking canceled successfully");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const updateFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { propertyId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user.favProperties.includes(propertyId)) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favProperties: {
            set: user.favProperties.filter((id) => id !== propertyId),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updatedUser });
    } else {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favProperties: {
            push: propertyId,
          },
        },
      });

      res.send({ message: "Updated favorites", user: updatedUser });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const favorites = await prisma.user.findUnique({
      where: { email },
      select: { favProperties: true },
    });

    res.status(200).send(favorites);
  } catch (error) {
    throw new Error(error.message);
  }
});
