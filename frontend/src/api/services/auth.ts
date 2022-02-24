import { request } from "../httpClient/client";
import { AuthResponse } from "../interfaces/auth";
import { CreateUser } from "../interfaces/createUser";

export async function login(
  email: string,
  password: string
): Promise<AuthResponse | { error: string }> {
  return request(
    "/auth/login",
    "POST",
    {
      email,
      password,
    },
    undefined
  );
}

export async function refresh(refresh_token: string) {
  // przecież można to zrpobić GET-em
  return request("/auth/refresh", "POST", undefined, {
    Authorization: `Bearer ${refresh_token}`,
  });
}

export async function logout(acces_token: string) {
  // przecież można to zrpobić GET-em
  return request("/auth/logout", "POST", undefined, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function register(createUserDto: CreateUser) {
  return request("/auth/register", "POST", createUserDto);
}
