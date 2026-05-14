function createFirebaseAuthClient({ auth, sdk }) {
  if (!auth) {
    throw new Error("Firebase Auth real e obrigatorio.");
  }
  if (!sdk) {
    throw new Error("Firebase Auth SDK real e obrigatorio.");
  }

  return {
    onChange(callback) {
      return sdk.onAuthStateChanged(auth, callback);
    },

    signInWithEmail(email, password) {
      return sdk.signInWithEmailAndPassword(auth, email, password);
    },

    signOut() {
      return sdk.signOut(auth);
    },

    async getIdToken(forceRefresh = false) {
      const user = auth.currentUser;
      if (!user) return null;
      return user.getIdToken(forceRefresh);
    },
  };
}

module.exports = { createFirebaseAuthClient };
