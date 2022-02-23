import client from "./client";
import { AuthResponse } from "./interfaces/auth";
import { CreateUser } from "./interfaces/createUser";

async function login(
  email: string,
  password: string
): Promise<AuthResponse | { error: string }> {
  return client("/auth/login", "POST", {
    email,
    password,
  });
}

async function refresh(refresh_token: string) {
  // przecież można to zrpobić GET-em
  return client("/auth/refresh", "POST", undefined, {
    'Authorization': `Bearer ${refresh_token}`,
  });
}

async function logout(acces_token: string) {
  // przecież można to zrpobić GET-em
  return client("/auth/logout", "POST", undefined, {
    'Authorization': `Bearer ${acces_token}`,
  });
}

async function register(createUserDto: CreateUser) {
  return client("/auth/register", "POST", createUserDto);
}
