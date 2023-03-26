// Below are some necessary imports
import React, {useState} from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import MovieIcon from '@material-ui/icons/Movie';
import { async } from '@firebase/util';
import {v4 as uuidv4} from 'uuid';
import { database, storage } from '../firebase';


// This is the component which will allow user to upload videos
// props are being passed from feed component
function UploadFile(props) {
    // error and seterror state default value is empty string
    // with the help of this state we will display any error in ui
  const [error,setError] = useState('');
  // loading and setloading state default value is false
  // with the help of this state we will show loader in ui
  const [loading,setLoading] = useState(false);
  

  // this function will work when upload option is clicked
  const handleChange = async(file) => {
    // if file is null, then we will change the state of error state and display error for 2 seconds
    if(file == null){
        setError("Please select a file first");
        setTimeout(() => {
            setError('');
        },2000)
        return
    };
    // file size must be less than equal to hundred mb
    if(file.size/(1024*1024) > 100){
        setError("This video size is very large");
        setTimeout(() => {
            setError('');
        },2000)
        return
    }
    // Now if valid file is selected then we will remove error if any and set loading true to denote the uploading status

    // A Universally Unique Identifier (UUID) is an identifier standard used in 
    // many non-MultiValue databases and software to generate a Unique ID outside of using incremental numbers.
    let uid = uuidv4();
    setLoading(true);

    // A reference can be thought of as a pointer to a file in the cloud. 
    // References are lightweight, so you can create as many as you need. 
    // They are also reusable for multiple operations
    // in our firebase we ahve users directory under which users are saved through uids under which we want to
    // save the image with the file name
    const uploadTask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
    
            uploadTask.on('state_changed',fn1,fn2,fn3); // listener 
            // provided three function
            // fn1 will run on any PROGRESS
            // fn2 will run in case of any ERROR
            // fn3 will run when SUCCESSFUL
            // Now below is the listener which will be active when file uploading starts
            
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
            // If there is any error then it will be displayed through set error state
            function fn3(){
                // Our video will be saved in firebase database and its url will be generated
                // below is the url of the image uploaded
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    console.log(url);

                    // we are storing likes ,comments ,post id , post url,user name, user profile, user id, 
                    // created id corresponding to a particular video
                    let obj = {
                        likes : [],
                        comments : [],
                        pId : uid,
                        pUrl : url,
                        uName : props.user.fullname,
                        uProfile : props.user.profileUrl,
                        userId : props.user.userId,
                        createdAt : database.getTimeStamp()
                    }
                    
                    // Firebase Realtime database is stuctured as a JSON tree while Cloud 
                    // Firestore stores data in documents (document is a set of key-value pairs) 
                    // and collections (collections of documents). 
                    // Realtime Database stores data in JSON tree while Cloud firestore stores 
                    // data in documents which is very similar to JSON
                    // we have the unique uid of the signed up user we will use it and save some necessary information in key value pair

                    database.posts.add(obj).then( async (ref) => { // not giving uid , firebase provide id by itself therefore we need to store
                        let res = await database.users.doc(props.user.userId).update({
                            postIds : props.user.postIds != null ? [...props.user.postIds,ref.id] : []
                        })
                    }).then(() => {
                        setLoading(false);
                    }).catch((err) => {
                        setError(err);
                        setTimeout(() => {
                            setError('');
                        },2000) 
                        setLoading(false);
                    })
                })
                setLoading(false);
            }
  }

  return (
    <div style={{marginTop:'5rem',marginBottom:'1rem'}}>
        {
            error!=''?<Alert severity="error">{error}</Alert>:
            <>
                <input type="file" accept='video/*' id="upload-input" style={{display:'none'}} onChange={(e) => handleChange(e.target.files[0])}/>
                <label htmlFor='upload-input'>
                    <Button variant='outlined' color='secondary' disabled={loading} component="span">
                        <MovieIcon/>&nbsp;Upload Video
                    </Button>
                </label>
                {loading && <LinearProgress color="secondary" style={{marginTop:'3%'}}/>}
            </> 
        }
    </div>
  )
}

export default UploadFile