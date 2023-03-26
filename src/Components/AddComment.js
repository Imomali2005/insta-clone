// Below are some necessary imports
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { database } from '../firebase';

// This component is basically handling the add comments functionality user can add comment on posts
function AddComment({userData,postData}) {
    const [text,setText] = useState('');
    // when ever user will click on post button then then we will collect 
    // the text of comment and users profile image along with the user name
    const handleClick = () => {
        let obj = {
            text : text,
            uProfileImage : userData.profileUrl,
            uName : userData.fullname
        }
        // after creating the object we will update it in our post comments database 
        database.comments.add(obj).then((doc) => {
            database.posts.doc(postData.postId).update({
                comments : [...postData.comments,doc.id]
            })
        })
        setText('')
    }

  return (
    <div style={{width:'100%'}}>
        {/* A text field which through which comment will be passed */}
        <TextField id="outlined-basic" label="Comment" variant="outlined" size="small" sx={{width:'70%'}} value={text} onChange={(e) => setText(e.target.value)}/>
        <Button variant="contained" onClick={handleClick}>Post</Button>        
    </div>
  )
}

export default AddComment