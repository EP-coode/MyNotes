import { request } from "../httpClient/client";
import { AuthResponse } from "../interfaces/auth";
import { CreateUser } from "../interfaces/createUser";

const authService = (apiUrl: string) => {
  async function login(
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
      undefined,
      apiUrl
    );
  }

  async function refresh(refresh_token: string) {
    // przecież można to zrpobić GET-em
    return request("/auth/refresh", "POST", undefined, {
      Authorization: `Bearer ${refresh_token}`,
    });
  }

  async function logout(acces_token: string) {
    // przecież można to zrpobić GET-em
    return request("/auth/logout", "POST", undefined, {
      Authorization: `Bearer ${acces_token}`,
    });
  }

  async function register(createUserDto: CreateUser) {
    return request("/auth/register", "POST", createUserDto);
  }

  return {
    login,
    logout,
    refresh,
    register,
  };
};

export default authService;
