import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";

import { UserContext } from "../lib/context";
import { useContext, useEffect, useCallback, useState } from "react";

import debounce from 'lodash.debounce';
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "../lib/firebase";



export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm/>
  // 3. user sign in, has username <SignOutButton/>
  return (
    <main>
      {
        user ?
          !username ? <UsernameForm /> : <SignOutButton />
          :
          <SignInButton />
      }
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} />
      Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }

  };

  // Hit the database or username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(debounce(async (username: String) => {
    if (username.length >= 3) {
      const ref = doc(firestore, `usernames/${username}`);
      const docSnap = await getDoc(ref);
      console.log('Firebase read executed !', docSnap.exists());
      setIsValid(!docSnap.exists());
      setLoading(false);
    }
  }, 500), []);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(firestore, 'users', `${user.uid}`);
    const usernameDoc = doc(firestore, 'usernames', `${formValue}`);

    // Commit both docs together as a batch write
    const batch = writeBatch(firestore);
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (e) {
      console.log((e as Error).message);
    }


  }


  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="username" value={formValue} onChange={onChange} />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}


function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>
  } else {
    return <p></p>
  }
}
