import type {
  CreateUserResponseDto,
  GetUserPhotoResponseDto,
  GetUserResponseDto,
} from '@/features/users/model/user.dto';
import type { CreateUserResult, User, UserPhoto } from '@/features/users/model/user.types';

function mapPhoto(dto: GetUserPhotoResponseDto): UserPhoto {
  return {
    id: dto.id,
    url: dto.url,
    sortOrder: dto.sortOrder,
    uploadedAt: new Date(dto.uploadedAt),
  };
}

export function mapCreateUserResponse(dto: CreateUserResponseDto): CreateUserResult {
  return {
    id: dto.id,
    email: dto.email,
  };
}

export function mapGetUserResponse(dto: GetUserResponseDto): User {
  return {
    id: dto.id,
    email: dto.email,
    isVerified: dto.isVerified,
    isSoftDeleted: dto.isSoftDeleted,
    userInfo: dto.userInfo
      ? {
          nationality: dto.userInfo.nationality,
          firstName: dto.userInfo.firstName,
          lastName: dto.userInfo.lastName,
          phoneNumber: dto.userInfo.phoneNumber,
          hasPhonePrefix: dto.userInfo.hasPhonePrefix,
          biography: dto.userInfo.biography,
        }
      : null,
    photos: dto.photos.map(mapPhoto),
  };
}
