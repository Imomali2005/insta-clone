import React,{useState,useEffect} from 'react'
import { auth } from '../firebase';
export const AuthContext = React.createContext();


export function AuthProvider({children}){
    const [user,setUser] = useState();
    const [loading,setLoading] = useState(true);

    // auth.createUserWithEmailAndPassword is the default function provided by firebase for signing up purpose
    function signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password);
    }

    // auth.signInWithEmailAndPassword is the default function for login purpose it also takes email and password
    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password);
    }

    // signout simply sign out the user
    function logout(){
        return auth.signOut();
    }

    // auth.sendPasswordResetEmail is the default function provided by firebase, it takes email and sends a password reset link
    function forgetpasword(email){
        return auth.sendPasswordResetEmail(email);
    }

    useEffect(() => {
        // component did mount
        // Adds an observer for changes to the user's sign-in state. 
        // Prior to 4.0. 0, this triggered the observer when users were signed in, signed out, or
        //  when the user's ID token changed in situations such as token expiry or password change.
        const unsub = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        })
        return () => {
            unsub() // to remove event listener
        }
    },[])

    // Created the global store
    const store = {
        user,
        signup,
        login,
        logout,
        forgetpasword
    }

    return (
        <AuthContext.Provider value={store}>
            {!loading && children}
        </AuthContext.Provider>
    )

}