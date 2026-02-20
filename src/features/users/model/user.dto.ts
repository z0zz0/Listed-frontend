export interface CreateUserRequestDto {
  email: string;
  password: string;
}

export interface CreateUserResponseDto {
  id: string;
  email: string;
}

export interface GetUserInfoResponseDto {
  nationality: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hasPhonePrefix: boolean;
  biography: string | null;
}

export interface GetUserPhotoResponseDto {
  id: string;
  url: string;
  sortOrder: number;
  uploadedAt: string;
}

export interface GetUserResponseDto {
  id: string;
  email: string;
  isVerified: boolean | null;
  isSoftDeleted: boolean;
  userInfo: GetUserInfoResponseDto | null;
  photos: GetUserPhotoResponseDto[];
}
