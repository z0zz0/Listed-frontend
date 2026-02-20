export interface CreateUserResult {
  id: string;
  email: string;
}

export interface UserInfo {
  nationality: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hasPhonePrefix: boolean;
  biography: string | null;
}

export interface UserPhoto {
  id: string;
  url: string;
  sortOrder: number;
  uploadedAt: Date;
}

export interface User {
  id: string;
  email: string;
  isVerified: boolean | null;
  isSoftDeleted: boolean;
  userInfo: UserInfo | null;
  photos: UserPhoto[];
}
