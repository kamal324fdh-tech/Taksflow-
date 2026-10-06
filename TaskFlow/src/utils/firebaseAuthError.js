const authErrorMessages = {
  "auth/admin-restricted-operation":
    "Email/password sign-up is disabled. In Firebase Console, open Authentication > Sign-in method and enable Email/Password.",
  "auth/operation-not-allowed":
    "Email/password sign-up is disabled. In Firebase Console, open Authentication > Sign-in method and enable Email/Password.",
  "auth/email-already-in-use":
    "This email already has an account. Log in instead or use a different email.",
  "auth/weak-password":
    "Firebase rejected this password. Choose a stronger password and check the project's password policy.",
  "auth/expired-action-code": "This reset link has expired. Request a new password reset email.",
  "auth/invalid-action-code": "This reset link is invalid or has already been used. Request a new one.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/too-many-requests":
    "Too many attempts were made. Wait a while before trying again.",
  "auth/network-request-failed":
    "Firebase could not be reached. Check your internet connection and try again.",
  "auth/requests-to-this-api-are-blocked":
    "The Firebase API key is restricted from calling Identity Toolkit. Update its API restrictions in Google Cloud Console.",
};

export function getFirebaseAuthErrorMessage(error) {
  if (authErrorMessages[error?.code]) return authErrorMessages[error.code];

  if (error?.code?.includes("api-key")) {
    return "The Firebase API key is invalid. Copy the Web app configuration from the same Firebase project used for Authentication.";
  }

  return error?.message || "Authentication failed. Please try again.";
}