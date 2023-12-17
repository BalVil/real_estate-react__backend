import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createProperty = asyncHandler(async (req, res) => {
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
    const property = await prisma.property.create({
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
      .send({ message: "Property created successfully", property });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("A property with the address is already there");
    } else {
      throw new Error(error.message);
    }
  }
});

export const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.send(properties);
});

export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      res.status(404).json({ message: "Not found" });
    }
    res.send(property);
  } catch (error) {
    throw new Error(error.message);
  }
});
