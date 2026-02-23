export interface AccessTokenResponseDto {
  token?: string;
  expiresAtUtc?: string;
  expiresInSeconds?: number;
}

export interface GetMeResponseDto {
  userId?: string;
  email?: string;
  authVersion?: number;
}
