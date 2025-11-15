import { getDataSource } from "@/libs/DB";
import { User } from "@/models/user";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import { Role } from "@/config/enum";
export async function createUserServer(data: User): Promise<Partial<User>> {
  try {
    const user = await registration(data);
    if (!user) {
      throw new Error("User registration failed");
    }
    return user;
  } catch (error) {
    throw error;
  }
}
export const getAllUsers = async () => {
  try {
    const dataSource = await getDataSource();
    const users = await dataSource
      .getRepository(User)
      .find({ order: { createdAt: "DESC" } });
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
      console.log("User not found");
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
};
export const registration = async (
  data: Partial<User>,
): Promise<Partial<User>> => {
  try {
    const { password, email, phone, role } = data;
    console.log("Registration data:", data);
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
      role: role || Role.USER,
    });

    const savedUser = await userRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  } catch (error: any) {
    console.error("Full error details:", error);
    throw error;
  }
};

export const authentication = async (data: Partial<User>): Promise<any> => {
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
      { expiresIn: "7d" },
    );
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
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

export const updateUser = async (data: Partial<User>, request: NextRequest) => {
  try {
    const { password, ...rest } = data;
    const id = getUserIdFromRequest(request);
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...rest };
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser.password = hashedPassword;
    }
    const savedUser = await userRepository.save(updatedUser);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};
export async function updateUserServer(data: any): Promise<Partial<User>> {
  try {
    const { id, password, ...rest } = data;
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: id });
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...rest };
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser.password = hashedPassword;
    }
    const savedUser = await userRepository.save(updatedUser);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}
export const verifyToken = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("Token not found");
  }
  try {
    const payload = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
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

export async function deleteUser(userId: string) {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.remove(user);
  } catch (error) {
    throw error;
  }
}
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

export const getUserFromRequest = async (
  request: NextRequest,
): Promise<User | null> => {
  const userId = getUserIdFromRequest(request);
  if (!userId) return null;

  try {
    return await getUserById(userId);
  } catch (error) {
    return null;
  }
};

export const checkUserRole = async (
  request: NextRequest,
  allowedRoles: Role[],
): Promise<boolean> => {
  const user = await getUserFromRequest(request);
  if (!user) return false;

  return allowedRoles.includes(user.role as Role);
};

export const isAdmin = async (request: NextRequest): Promise<boolean> => {
  return await checkUserRole(request, [Role.ADMIN]);
};

export const isUser = async (request: NextRequest): Promise<boolean> => {
  return await checkUserRole(request, [Role.USER, Role.ADMIN]);
};
