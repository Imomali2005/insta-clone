// Below are some necessary imports
import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import { database } from '../firebase'
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar' 
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Like from './Like';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Like2 from './Like2';
import AddComment from './AddComment';
import Comments from './Comments'
import './Profile.css'


// This component is maintaining the users profile
function Profile() {
    // The useParams hook returns an object of key/value pairs of 
    // the dynamic params from the current URL that were matched by the <Route path> . 
    // Child routes inherit all params from their parent routes.
    const {id} = useParams()
    // below is the state which will maintain user data
    const [userData,setUserdata] = useState(null)
    // posts will look after all the posts posted by the user
    const [posts,setPosts] = useState(null)
    // here also user can play the posts, below state is maintaining the same
    const [open, setOpen] = useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };

    useEffect(()=>{
        // fetching the data of the user
        database.users.doc(id).onSnapshot((snap)=>{
            setUserdata(snap.data())
        })
        // in accordance to the id passed in the url
    },[id])

    useEffect(async()=>{
        // The optional chaining operator ( ?. ) enables you to read the value 
        // of a property located deep within a chain 
        // of connected objects without having to check that each reference in the chain is valid.
        if(userData!=null){
        let parr = [];
        // if user data is not null then collecting all the the posts of the user if present
        for(let i=0;i<userData?.postIds?.length;i++){
            let postData = await database.posts.doc(userData.postIds[i]).get()
            parr.push({...postData.data(),postId:postData.id})
        }
        // updating the posts state
        setPosts(parr)
    }
    },[userData])

    return (
        <>
        {
            posts==null || userData==null ? <CircularProgress/> : 
            <>
                <Navbar userData={userData}/>
                {/* Navbar is the same */}
                <div className="spacer"></div>
                <div className="container">
                    {/* Displaying user image, email and number of posts */}
                    <div className="upper-part">
                        <div className="profile-img">
                            <img src={userData.profileUrl}/>
                        </div>
                        <div className="info">
                            <h1>Post: 40 </h1>
                            <h1>Followers: 1,2K </h1>
                            <h1>Following: 3,4K</h1>
                            <Typography variant="h5">
                                Email : {userData.email}
                            </Typography>
                            <Typography variant="h6">
                                Posts : {userData?.postIds?.length}
                            </Typography>
                        </div>
                    </div>
                    <hr style={{marginTop:'3rem',marginBottom:'3rem'}}/>
                    <div className="profile-videos">
                     {
                        // Iterating through each post and displaying them
                        posts.map((post,index)=>(
                            <React.Fragment key={index}>
                                <div className="videos">
                                    <video muted="muted" onClick={()=>handleClickOpen(post.pId)}>
                                        <source src={post.pUrl}/>
                                    </video>
                                    <Dialog
                                        open={open==post.pId}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                        fullWidth ={true}
                                        maxWidth = 'md'
                                    >
                                        <div className="modal-container">
                                            <div className="video-modal">
                                                <video autoPlay={true} muted="muted" controls>
                                                    <source src={post.pUrl}/>
                                                </video>
                                            </div>
                                            <div className="comment-modal">
                                            <Card className="card1" style={{padding:'1rem'}}>
                                                <Comments postData={post}/>
                                            </Card>
                                                <Card variant="outlined" className="card2">
                                                    <Typography style={{padding:'0.4rem'}}>{post.likes.length==0?'Liked by nobody':`Liked by ${post.likes.length} users`}</Typography>
                                                    <div style={{display:'flex'}}>
                                                        <Like2 postData={post} userData={userData} style={{display:'flex',alignItems:'center',justifyContent:'center'}}/>
                                                        <AddComment style={{display:'flex',alignItems:'center',justifyContent:'center'}} userData={userData} postData={post}/>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    </Dialog>
                                </div>
                            </React.Fragment>
                        ))
                        
                     }
                </div>
                </div>
            </>
        }
        </>
    )
}

export default Profile
