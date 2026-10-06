import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  reload,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

function friendlyAuthError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// Builds the plain object we keep in state from a Firebase user object.
// Kept as one function so register/login/refresh all shape it the same way.
const toAppUser = (firebaseUser) => ({
  uid: firebaseUser.uid,
  name: firebaseUser.displayName,
  email: firebaseUser.email,
  emailVerified: firebaseUser.emailVerified,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toAppUser(firebaseUser) : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await sendEmailVerification(credential.user);
    setUser(toAppUser(credential.user));
  };

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    setUser(toAppUser(credential.user));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Firebase's emailVerified flag doesn't update live — reload() re-fetches
  // the account from Firebase's servers, so this checks "has the link
  // actually been clicked yet?" instead of relying on stale local data.
  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    setUser(toAppUser(auth.currentUser));
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const updateUser = async ({ name, email }) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("You must be signed in to update your profile.");

    const nextEmail = email.trim();
    const emailChangeRequested = nextEmail.toLowerCase() !== firebaseUser.email?.toLowerCase();
    if (emailChangeRequested) {
      await verifyBeforeUpdateEmail(firebaseUser, nextEmail);
    }

    await updateProfile(firebaseUser, { displayName: name.trim() });
    setUser(toAppUser(firebaseUser));
    return { emailChangeRequested };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        refreshUser,
        resendVerificationEmail,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}