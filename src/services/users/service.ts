import { getDataSource } from "@/libs/DB";
import { User } from "@/models/user";
import { logger } from "@/libs/Logger";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
export const getAllUsers = async () => {
  try {
    const dataSource = await getDataSource();
    const users = await dataSource.getRepository(User).find();
    logger.info("Users fetched successfully");
    if (!users) {
      throw new Error("Users not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const dataSource = await getDataSource();
    const user = await dataSource.getRepository(User).findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    logger.info("User fetched successfully");
    return user;
  } catch (error) {
    throw error;
  }
};
export const getUserByEmail = async (email: string) => {
  try {
    const dataSource = await getDataSource();
    const user = await dataSource.getRepository(User).findOneBy({ email });
    if (!user) {
      logger.info(`User with email ${email} not found`);
      return null;
    }
    logger.info("User fetched successfully");
    return user;
  } catch (error) {
    throw error;
  }
};
export const registration = async (
  data: Partial<User>,
): Promise<Partial<User>> => {
  try {
    const { password, email, phone } = data;

    if (!password || !email || !phone) {
      throw new Error("Password, email and phone are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = userRepository.create({
      password: hashedPassword,
      email,
      phone,
    });

    const savedUser = await userRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  } catch (error: any) {
    logger.error("Failed to create user:", error);
    console.error("Full error details:", error);
    throw error;
  }
};

export const authentication = async (
  data: Partial<User>,
  response: NextResponse,
): Promise<Partial<User>> => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect email or password");
    }
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" },
    );
    const { password: _, ...userWithoutPassword } = user;
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export const logout = async (response: NextResponse) => {
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
};

export const verifyToken = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("Token not found");
  }
  try {
    const payload = verify(token, "secret") as JwtPayload;
    const user = await getUserById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export const getUserIdFromRequest = (
  request: NextRequest,
): string | undefined => {
  const token = request.cookies.get("token")?.value;
  if (!token) return undefined;
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as any;
    return payload?.id;
  } catch (e) {
    return undefined;
  }
};
export const getUserIdFromToken = (token: string): string | undefined => {
  if (!token) return undefined;
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as any;
    return payload?.id;
  } catch (e) {
    return undefined;
  }
};
export const ensureSessionCookie = (
  request: NextRequest,
  response: NextResponse,
) => {
  let sessionId = request.cookies.get(
    process.env.NAME_SESSION_ID as string,
  )?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    response.cookies.set({
      name: process.env.NAME_SESSION_ID as string,
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });
  }
  return sessionId;
};
