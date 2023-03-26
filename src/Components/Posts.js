// Below are some necessary imports
import React, { useEffect, useState } from 'react';
import {database} from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Video from './Video';
import Avatar from '@mui/material/Avatar';
import './Posts.css';
import Like from './Like';
import ChatIcon from '@material-ui/icons/Chat';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Like2 from './Like2';
import AddComment from './AddComment';
import Comments from './Comments';



// This component will handle all the posts uploaded by different users
function Posts({userData}) {
    // useState is a Hook that allows you to have state variables in functional components. 
    // You pass the initial state to this function and it returns a variable with 
    // the current state value (not necessarily the initial state) and another function to update this value.
    // we have defined several states using usestate here
  const [posts,setPosts] = useState(null);
//   if user will click on any post then a modal will appear to post comment, below state is handling the same
  const [open, setOpen] =  useState(false);


  const handleClickOpen = (id) => {
    setOpen(id);
  };

  const handleClose = () => {
    setOpen(null);
  };


  useEffect(() => {
    let parr = []
    // we are basically filling out posts array by reading all the posts 
    // sorting them according to their created timestamp in descending order
    const unsub = database.posts.orderBy('createdAt','desc').onSnapshot((querySnapshot) => {
        
        parr = []
        querySnapshot.forEach((doc) => {
            let data = {...doc.data(),postId:doc.id}
            // console.log(data)
            parr.push(data)
        })
        // after filling post array we will update the set posts state
        setPosts(parr);
    })
    
    return unsub
  },[])

  // observer

  const callback = (entries) => {
    entries.forEach((entry) => {
        let ele = entry.target.childNodes[0]
        console.log(ele)
        ele.play().then(() => {
            if(!ele.paused && !entry.isIntersecting){
                ele.pause()
            }
        })
    })
    }
    // The Intersection Observer API provides a way to asynchronously 
    // observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.
    // Each intersection observer entry is a dictionary containing details about 
    // the intersection between a particular target and the root. This includes a timestamp, 
    // the intersection rectangle, 
    // and an intersection ratio that represents the fraction of 
    // the target that's contained within the intersection rectangle.
    // we have fixed threshhold as 60% of the viewport
    let observer = new IntersectionObserver(callback, {threshold:0.6});
    useEffect(() => {
        // we are applying api in our video container only, which contains all the videos
        const elements = document.querySelectorAll(".videos");
        elements.forEach((element) => {
            observer.observe(element)
        })
        return () => {
            observer.disconnect()
        }
        //  useeffect will be called whenever posts will update
    },[posts])

  return (
    <div>
        {
            // if posts and user are not empty then flow continues or else progress bar is shown
            posts==null || userData==null ? <CircularProgress color="secondary" /> : 
            <div className='video-container'>
                {
                    // Iterating through the posts
                    posts.map((post,index) => (
                        // A common pattern in React is for a component to return multiple elements. 
                        // Fragments let you group a list of children without adding extra nodes to the DOM.
                        <React.Fragment key={index}>
                            <div className='videos'>
                                {/* passing the url of the posted video to video component */}
                                <Video src={post.pUrl} />
                                <div className='fa' style={{display:'flex'}}>
                                    {/* In a flex right position user profile image and like option is shown */}
                                <Avatar src={userData.profileUrl}/>
                                <h4>{userData.fullname}</h4>
                                </div>
                                {/* like functionality is handled in different component */}
                                <Like userData={userData} postData={post}/>
                                {/* we have a chaticon clicking on which a modal will appear */}
                                <ChatIcon className='chat-styling' onClick={() => handleClickOpen(post.pId)}/>
                                <Dialog
                                // if open is called for the same post then dialog box will appear
                                    open={open == post.pId}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth = {true}
                                    maxWidth = 'md'
                                >
                                    {/* It will also contain that video */}
                                    <div className='modal-container'>
                                        <div className='video-modal'>
                                            <video autoPlay={true} muted="muted" controls>
                                                <source src={post.pUrl}/>
                                            </video>
                                        </div>
                                        <div className='comment-modal'>
                                        {/* Comments are handled in different component */}
                                        <Card className='card1' style={{padding:'1rem'}}>
                                            <Comments postData={post} />
                                        </Card>
                                        {/* In the modal number of likes is shown and user can like again */}
                                        <Card variant='outlined' className='card2'> 
                                            <Typography style={{padding:'0.4rem'}}>
                                                {post.likes.length==0 ? '' : `Liked by ${post.likes.length} users`}
                                            </Typography>
                                            <div style={{display:'flex'}}>
                                                <Like2 postData={post} userData={userData} style={{display:'flex',alignItems:'center',justifyContent:'center'}}/>
                                                {/* adding comment functionality is handled in different component */}
                                                <AddComment postData={post} userData={userData}/>
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
        }
    </div>
  )
}

export default Posts