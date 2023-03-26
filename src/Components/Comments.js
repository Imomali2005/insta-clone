// Below are some necessary imports
import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { database } from '../firebase'

// This component is basically fetching all the comments of a particular post and displaying them
function Comments({postData}) {
    const [comments,setComments] = useState(null)
    useEffect(async() => {
        let arr = []
        // iterating through all the comments of a particular post, we have saved a comments array for each post
        for(let i=0;i<postData.comments.length;i++){
            // now fetching particular comment and adding its data to another array
            let data = await database.comments.doc(postData.comments[i]).get();
            arr.push(data.data());
        }
        setComments(arr);
    },[postData])

  return (
    <div>
        {
            // if comments are null initially the show progress bar 
            comments==null ? 
            <CircularProgress color="secondary" /> :
            <>
            {
                // for each comment we will terate and display the commenter profile image along with the user name and their comment
                comments.map((comment,index) => (
                    <div style={{display:'flex'}}>
                        <Avatar src={comment.uProfileImage}/>
                        <p>&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{comment.uName}</span>&nbsp;&nbsp;{comment.text}</p>
                    </div>
                ))
            }
            </>
        }
    </div>
  )
}

export default Comments