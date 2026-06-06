export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: "bearer";
  user: AuthUser;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
