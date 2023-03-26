// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// we get all this sinformation when we create any new project and use firebase as a backend service
const firebaseConfig = {
    apiKey: "AIzaSyDC7DrXkWzzvU5jmG4CWzpliHKivZDvclw",
    authDomain: "reels-3aa5c.firebaseapp.com",
    projectId: "reels-3aa5c",
    storageBucket: "reels-3aa5c.appspot.com",
    messagingSenderId: "367213807830",
    appId: "1:367213807830:web:3eeb39f56db6a58351e177"
};

// Initialize Firebase
// initializeApp ( options : Object , name ? : string ) : App. Creates and initializes a Firebase app instance.
firebase.initializeApp(firebaseConfig);

// easy-to-use SDKs, and ready-made UI libraries to authenticate users to your app.
// It supports authentication using passwords, phone numbers, 
// popular federated identity providers like Google, Facebook and Twitter, and more.
export const auth = firebase.auth();

// Firestore is a NoSQL document database built for automatic scaling, high performance, 
// and ease of application development. While the Firestore interface has many of the same features as traditional databases, 
// as a NoSQL database it differs from them in the way it describes relationships between data objects.
const firestore = firebase.firestore();

// A Collection Reference can be used for adding documents, getting document
export const database = {
    users : firestore.collection('users'),
    getTimeStamp : firebase.firestore.FieldValue.serverTimestamp,
    posts : firestore.collection('posts'),
    comments : firestore.collection('comments'),
}

// Firebase enables you to natively use Cloud Storage when developing web and mobile applications. 
// Firebase Storage is an object storage service you can access via Google Cloud Platform. 
// When using Google Firebase Storage, you can access files through references, 
// /easily upload files, and also monitor progress with tasks.
export const storage =  firebase.storage()
