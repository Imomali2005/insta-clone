// Author : Ayush Mangore
// This project is basically a clone of some functionalities offered by instagram
// Here user can upload reels and features like auto scroll is there and also users can maintain their profile
// User can also like or comment in any post



// Used react 
// React allows developers to create large web applications that can change data, 
// without reloading the page. The main purpose of React is to be fast, 
// scalable, and simple. It works only on user interfaces in the application. 
// This corresponds to the view in the MVC template.

// Used material ui for designing
// Material-UI is simply a library that allows us to import and use different 
// components to create a user interface in our React applications. 
// This saves a significant amount of time since the developers do not need to write everything from scratch

// Used firebase as a backend service
// Firebase is an all-in-one backend as a service provider (BaaS) 
// that provides a database, authentication, and cloud storage among its many services

// Below are some necessary imports
import * as React from 'react';
import {useState,useEffect, useContext} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Alert from '@mui/material/Alert';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './SignUp.css'
import insta from '../Assets/Instagram.JPG'
import {Link, useHistory} from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext';
import { async } from '@firebase/util';
import { database,storage } from '../firebase';


// This component is basically for signup page , here we have provided the signup functionality for the user
export default function SignUp() {
    // makeStyles is a function from Material-UI that allows us to create 
    // CSS classes and rules using JavaScript objects. The makeStyles function 
    // returns a React hook that we can use in a functional component to access the styles and classes. 
    // Then, we can apply these styles to any element in our component.
    const useStyles = makeStyles({
        text1:{
            color:'grey',
            textAlign:'center'
        },
        card2:{
            height:'5vh',
            marginTop:'2%'
        }
    })

    const classes = useStyles();

    // useState is a Hook that allows you to have state variables in functional components. 
    // You pass the initial state to this function and it returns a variable with 
    // the current state value (not necessarily the initial state) and another function to update this value.
    // we have defined several states using usestate here

    // email and setemail state default value is empty string
    const [email,setEmail] = useState('');
    // password and setpassword state default value is empty string
    const [password,setPassword] = useState('');
    // name and setname state default value is empty string
    const [name,setName] = useState('');
    // file and setfile state default value is null
    // this state will help in fetching user profile picture which we will upload in our database
    const [file,setFile] = useState(null);
    // error and seterror state default value is empty string
    // with the help of this state we will display any error in ui
    const [error,setError] = useState('');
    // loading and setloading state default value is false
    // with the help of this state we will show loader in ui
    const [loading,setLoading] = useState(false);
    
    // This is one of the most popular hooks provided by React Router.
    //  It lets you access the history instance used by React Router. 
    // Using the history instance you can redirect users to another page
    const history = useHistory();

    // we have defined all the function related to firebase authentication in a global store which we have imported here
    // “useContext” hook is used to create common data that can be accessed 
    // throughout the component hierarchy without passing the props down manually to each level. 
    // Context defined will be available to all the child components without involving “props”.
    const {signup} = useContext(AuthContext);

    // This is the function which will be invoked when users will upload the picture for their profile 
    const handleClick= async() => {
        // if file is null, then we will change the state of error state and display error for 2 seconds
        if(file == null){
            setError("Please upload profile picture first");
            setTimeout(() => {
                setError('')
            },2000)
            return;
        }
        try{
            // Now if valid file is selected then we will remove error if any and set loading true to denote the uploading status
            
            setError('');
            setLoading(true);
            // now we will use our signup function which takes email and password for the signup. 
            let userObj = await signup(email,password);

            // The uid is a random id generated by the Firebase server side system. 
            // That uid does not change once the account is created. 
            // When you delete an account, the uid is also deleted. 
            // The uid is how you want to identify your various users.

            let uid = userObj.user.uid;
            console.log(uid);

            // A reference can be thought of as a pointer to a file in the cloud. 
            // References are lightweight, so you can create as many as you need. 
            // They are also reusable for multiple operations
            // in our firebase we ahve users directory under which users are saved through uids under which we want to
            // save the image with the name profile image
            const uploadTask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
            // Now below is the listener which will be active when file uploading starts
            uploadTask.on('state_changed',fn1,fn2,fn3); // listener 
            // provided three function
            // fn1 will run on any PROGRESS
            // fn2 will run in case of any ERROR
            // fn3 will run when SUCCESSFUL

            // A DataSnapshot contains data from a Database location. 
            // Any time you read data from the Database, you receive the data as a DataSnapshot
            function fn1(snapshot){
                // we are calculating the uploading progress here
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress} done`); 
            }
            function fn2(error){
                // If there is any error then it will be displayed through set error state
                setError(error);
                setTimeout(() => {
                    setError('')
                },2000)
                setLoading(false);
                return;
            }
            function fn3(){
                // this function will work  when upload task is successful
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    // Our image will be saved in firebase database and its url will be generated
                    // below is the url of the image uploaded
                    console.log(url);
                    // Firebase Realtime database is stuctured as a JSON tree while Cloud 
                    // Firestore stores data in documents (document is a set of key-value pairs) 
                    // and collections (collections of documents). 
                    // Realtime Database stores data in JSON tree while Cloud firestore stores 
                    // data in documents which is very similar to JSON
                    // we have the unique uid of the signed up user we will use it and save some necessary information in key value pair

                    database.users.doc(uid).set({
                        email : email,
                        userId : uid,
                        fullname : name,
                        profileUrl : url,
                        // A Timestamp represents a point in time independent of any time zone or calendar, 
                        // represented as seconds and fractions of seconds at nanosecond resolution in UTC Epoch time. 
                        // It is encoded using the Proleptic Gregorian Calendar which extends the Gregorian calendar backwards to year one.
                        createdAt : database.getTimeStamp()
                    })
                })
                // Now no further loading and user will be redirected to feeds page
                setLoading(false);
                history.push('/'); // automatically go to feed
            }
        }catch(err){
            // If there is some error while uploading then displayed using set error
            setError(error);
            setTimeout(() => {
                setError('')
            },2000)
            return;
        }
    }
    // We can create a functional component to React by writing a JavaScript function. 
    // These functions may or may not receive data as parameters. 
    // In the functional Components, the return value is the JSX code to render to the DOM tree.
  return (
      <div className='signupWrapper'>
          <div className='signupCard'>
                        <Card varient = "outlined">
                            <div className="insta-logo">
                                {/* image stored in the assets folder imported as insta */}
                                <img src={insta}/>
                            </div>
                            <CardContent>
                                <Typography className={classes.text1} variant="subtitle1">
                                    Sign up to see photos and videos from your friends
                                </Typography>
                                {/* if there is some error we will display in alert or else flow will continue */}
                                {error !='' && <Alert severity="error">{error}</Alert>}
                                {/* Below is the input text field for email, through which we are updating email state with the help of setemail function */}
                                <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin='dense' size='small' value={email} onChange={(e) => setEmail(e.target.value)}/>
                                {/* Below is the input text field for password, through which we are updating password state with the help of setpassword function */}
                                <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin='dense' size='small' value={password} onChange={(e) => setPassword(e.target.value)}/>
                                 {/* Below is the input text field for name, through which we are updating name state with the help of setname function */}
                                <TextField id="outlined-basic" label="Full Name" variant="outlined" fullWidth={true} margin='dense' size='small' value={name} onChange={(e) => setName(e.target.value)}/>
                                {/* Here is the button to upoad image */}
                                <Button size="small" color='secondary' fullWidth={true} variant='outlined' margin='dense' startIcon={<CloudUploadIcon/>} component="label">
                                    Upload Profile Image
                                    <input type='file' accept='image/*' hidden onChange={(e)=>setFile(e.target.files[0])}/>
                                </Button>
                            </CardContent>
                            <CardActions>
                                {/* Below is the buttonn, after clicking on which user will be signed up */}
                                <Button color='primary' fullWidth={true} variant='contained' disabled={loading} onClick={handleClick}>
                                    Sign Up
                                </Button>
                            </CardActions>
                            <CardContent>
                                <Typography className={classes.text1} variant="subtitle1">
                                    By signing up, you agree to our Terms, Conditions and Cookies policy. 
                                </Typography>
                            </CardContent>
                    </Card>
                    {/* If user already has account then redirect to login page with the help of link
                    In regular apps without a library like React, links are created with an anchor tag, as shown below. 
                    Bear in mind that this also works in React. This method of routing causes a full page refresh, 
                    when in reality the only thing that changed on the new route might be just an image and some text. */}
                    <Card variant='outlined' className={classes.card2}>
                                <Typography className={classes.text1} variant="subtitle1" marginTop='none'>
                                    Having an account ? <Link to="/login"style={{textDecoration:'none'}}>Login</Link>
                                </Typography>
                    </Card>
          </div>
      </div>
  );
}