import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (data) => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash
    },
    include: { userRoles: true }
  });

  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  if (userRole) {
    await prisma.userRole.create({
      data: { userId: user.id, roleId: userRole.id }
    });
  }

  return { message: "User registered successfully", userId: user.id };
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userRoles: { include: { role: true } } }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid email or password");
  }

  const role = user.userRoles[0]?.role?.name || "USER";

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role
    }
  };
};

export const refreshToken = async (token) => {
  throw new Error("Refresh token logic to be implemented");
};

export const logout = async (token) => {
  await prisma.refreshToken.deleteMany({ where: { tokenHash: token } });
};
