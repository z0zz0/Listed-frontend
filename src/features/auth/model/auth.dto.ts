export interface AccessTokenResponseDto {
  token?: string;
  expiresAtUtc?: string;
  expiresInSeconds?: number;
}

export interface GetAuthSessionResponseDto {
  userId?: string;
  email?: string;
  authVersion?: number;
}
