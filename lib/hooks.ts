import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'


export function useUserData() {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      console.log(user.uid);
      const ref = doc(firestore, 'users', `${user.uid}`)
      unsubscribe = onSnapshot(ref, doc => {
        setUsername(doc.data().username)
      })
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}