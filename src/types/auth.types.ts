export interface loginPayload {
  email: string;
  password: string;
}

export interface registerPayload {
  email: string;
  password: string;
  role: string;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface resetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
