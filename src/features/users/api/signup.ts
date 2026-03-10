import { apiPaths } from '@/app/router/paths';
import type {
  CompleteSignupResponseDto,
  SaveSignupProfileResponseDto,
  StartSignupResponseDto,
  VerifySignupEmailResponseDto,
} from '@/features/users/model/signup.dto';
import {
  mapCompleteSignupResponse,
  mapSaveSignupProfileResponse,
  mapStartSignupResponse,
  mapVerifySignupEmailResponse,
  type CompleteSignupPayload,
  type SaveSignupProfilePayload,
  type StartSignupPayload,
  type VerifySignupEmailPayload,
} from '@/features/users/model/signup.mappers';
import { httpClient } from '@/shared/api/httpClient';

export async function startSignup(email: string, signal?: AbortSignal): Promise<StartSignupPayload> {
  const payload = {
    email: email.trim(),
  };

  const response = await httpClient.post<StartSignupResponseDto>(apiPaths.users.signup.start, payload, {
    signal,
    credentials: 'include',
  });

  return mapStartSignupResponse(response);
}

export async function verifySignupEmail(
  signupId: string,
  verificationCode: string,
  signal?: AbortSignal,
): Promise<VerifySignupEmailPayload> {
  const payload = {
    signupId,
    verificationCode: verificationCode.trim(),
  };

  const response = await httpClient.post<VerifySignupEmailResponseDto>(apiPaths.users.signup.verifyCode, payload, {
    signal,
    credentials: 'include',
  });

  return mapVerifySignupEmailResponse(response);
}

export async function saveSignupProfile(
  signupId: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  signal?: AbortSignal,
): Promise<SaveSignupProfilePayload> {
  const payload = {
    signupId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth,
  };

  const response = await httpClient.post<SaveSignupProfileResponseDto>(apiPaths.users.signup.personalInfo, payload, {
    signal,
    credentials: 'include',
  });

  return mapSaveSignupProfileResponse(response);
}

export async function completeSignup(signupId: string, password: string, signal?: AbortSignal): Promise<CompleteSignupPayload> {
  const payload = {
    signupId,
    password,
  };

  const response = await httpClient.post<CompleteSignupResponseDto>(apiPaths.users.signup.complete, payload, {
    signal,
    credentials: 'include',
  });

  return mapCompleteSignupResponse(response);
}
