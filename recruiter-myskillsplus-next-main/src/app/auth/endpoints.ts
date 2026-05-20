import { profile } from "console";

// export const BASE_URL = "http://127.0.0.1:8000/";
export const BASE_URL = "https://api.myskillsplus.com/";

export const API = {
  login: `${BASE_URL}users/api/custom-token/login/`,
  register: `${BASE_URL}api/register/`,
  forgotPassword: `${BASE_URL}api/password-reset/`,
  resetPassword: `${BASE_URL}users/api/forget-password/`,
  refreshToken: `${BASE_URL}api/token/refresh/`,
  verifyToken: `${BASE_URL}api/token/verify/`,
  getUserByToken: `${BASE_URL}users/me`,
  resendVerification:`${BASE_URL}users/api/resend-verification-email`,
  verifyPayment:`${BASE_URL}users/api/verify-payment/`,

  // profile API's
  addSkills: `${BASE_URL}add-skills/`,
  deleteSkill: `${BASE_URL}delete-skill/`,
  getSkills: `${BASE_URL}get-skills/`,
  getSharedUserSkills: `${BASE_URL}get-shared-user-skills/`,
  addReviewUser: `${BASE_URL}add-review-user/`,
  getReviewProfile: `${BASE_URL}review-user/profile`,
  submitReview: `${BASE_URL}review-user/profile/submit`,
  getPeersFeedback: `${BASE_URL}get-peers-feedback/`,
};
