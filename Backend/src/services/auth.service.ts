import { UserEntity } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import { Roles } from '../constants/roles';
import { v4 as uuidv4 } from 'uuid';

const registerUser = async (name: string, email: string, password: string, userType: string) => {
  // Check if user already exists
  const userExisting = await UserEntity.scan
    .where(({ email: userEmail }, { eq }) => eq(userEmail, email))
    .go();

  if (userExisting.data.length) throw new ApiError('Email already registered', 400);

  const userId = uuidv4();
  const hashed = await hashPassword(password);
  await UserEntity.put({ userId, name, email, password: hashed, userType: userType }).go();

  const payload = { userId, email, role: userType };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const user = { userId, name, email };

  return { user, tokens: { accessToken, refreshToken } };
};

const loginUser = async (email: string, password: string) => {
  // Find user by email
  const userResult = await UserEntity.scan
    .where(({ email: userEmail }, { eq }) => eq(userEmail, email))
    .go();

  const user = userResult.data[0];
  if (!user) throw new ApiError('Invalid credentials', 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ApiError('Invalid credentials', 401);

  const payload = { userId: user.userId, email: user.email, role: user.userType };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, tokens: { accessToken, refreshToken } };
};

const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await UserEntity.get({ userId }).go();

  if (!user.data) throw new ApiError('User not found', 404);

  const isMatch = await comparePassword(currentPassword, user.data.password);
  if (!isMatch) throw new ApiError('Current password is incorrect', 400);

  const hashedNewPassword = await hashPassword(newPassword);
  await UserEntity.update({ userId }).set({ password: hashedNewPassword }).go();
  return { message: 'Password changed successfully' };
};

const getUsers = async (role: string) => {
  if (role) {
    return await UserEntity.find({})
      .where(({ userType }, { eq }) => eq(userType, role))
      .go();
  } else {
    return await UserEntity.find({}).go();
  }
};

export { registerUser, loginUser, changeUserPassword, getUsers };
