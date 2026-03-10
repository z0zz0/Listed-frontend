import { useCallback, useState } from 'react';

import { completeSignup, saveSignupProfile, startSignup, verifySignupEmail } from '@/features/users/api/signup';
import type { CompleteSignupPayload } from '@/features/users/model/signup.mappers';
import { signupSteps, type SignupStep } from '@/features/users/model/signup.types';
import type { ApiError } from '@/shared/api/apiError';

interface SignupState {
  step: SignupStep;
  signupId: string | null;
  email: string | null;
  codeExpiresAtUtc: string | null;
  verifiedAtUtc: string | null;
}

function createMissingSignupStateError(): ApiError {
  return {
    status: 400,
    code: 'User.Validation.SignupStateMissing',
    message: 'User.Validation.SignupStateMissing',
  };
}

export function useSignupFlow() {
  const signupStepSequence: SignupStep[] = [signupSteps.start, signupSteps.verifyCode, signupSteps.personalInfo, signupSteps.complete];
  const [state, setState] = useState<SignupState>({
    step: signupSteps.start,
    signupId: null,
    email: null,
    codeExpiresAtUtc: null,
    verifiedAtUtc: null,
  });

  const goBack = useCallback(() => {
    setState((previousState) => {
      const currentIndex = signupStepSequence.indexOf(previousState.step);
      if (currentIndex <= 0) {
        return previousState;
      }

      return {
        ...previousState,
        step: signupStepSequence[currentIndex - 1],
      };
    });
  }, [signupStepSequence]);

  const submitStart = useCallback(async (email: string) => {
    const response = await startSignup(email);

    setState({
      step: signupSteps.verifyCode,
      signupId: response.signupId,
      email: response.email,
      codeExpiresAtUtc: response.codeExpiresAtUtc,
      verifiedAtUtc: null,
    });
  }, []);

  const submitVerifyCode = useCallback(
    async (verificationCode: string) => {
      if (!state.signupId) {
        throw createMissingSignupStateError();
      }

      const response = await verifySignupEmail(state.signupId, verificationCode);

      setState((previousState) => ({
        ...previousState,
        step: signupSteps.personalInfo,
        verifiedAtUtc: response.verifiedAtUtc,
      }));
    },
    [state.signupId],
  );

  const submitPersonalInfo = useCallback(
    async (firstName: string, lastName: string, dateOfBirth: string) => {
      if (!state.signupId) {
        throw createMissingSignupStateError();
      }

      await saveSignupProfile(state.signupId, firstName, lastName, dateOfBirth);

      setState((previousState) => ({
        ...previousState,
        step: signupSteps.complete,
      }));
    },
    [state.signupId],
  );

  const submitComplete = useCallback(
    async (password: string): Promise<CompleteSignupPayload> => {
      if (!state.signupId) {
        throw createMissingSignupStateError();
      }

      return completeSignup(state.signupId, password);
    },
    [state.signupId],
  );

  return {
    state,
    goBack,
    submitStart,
    submitVerifyCode,
    submitPersonalInfo,
    submitComplete,
  };
}
