import { useEffect, useMemo, useState } from "react";
import * as firebaseAuthSdk from "firebase/auth";
import { createFirebaseAuthClient } from "@prisma13/integrations";
import { firebaseAuth } from "../firebaseClient";

export function useAuth() {
  const client = useMemo(() => createFirebaseAuthClient({
    auth: firebaseAuth,
    sdk: firebaseAuthSdk,
  }), []);
  const [state, setState] = useState({
    loading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    return client.onChange((user) => {
      setState({ loading: false, user, error: null });
    });
  }, [client]);

  return {
    ...state,
    signInWithEmail: client.signInWithEmail,
    signOut: client.signOut,
    getIdToken: client.getIdToken,
  };
}
