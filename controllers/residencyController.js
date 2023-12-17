import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    image,
    facilities,
    userEmail,
  } = req.body.data;

  try {
    const residency = await prisma.property.create({
      data: {
        title,
        description,
        price,
        address,
        city,
        image,
        facilities,
        owner: { connect: { email: userEmail } },
      },
    });

    res
      .status(201)
      .send({ message: "Residency created successfully", residency });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("A residency with the address is already there");
    } else {
      throw new Error(error.message);
    }
  }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.send(residencies);
});

export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.property.findUnique({ where: { id } });
    if (!residency) {
      res.status(404).json({ message: "Not found" });
    }
    res.send(residency);
  } catch (error) {
    throw new Error(error.message);
  }
});
