// Below are some necessary imports
import React, { useState,useEffect } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { database } from '../firebase';

// This is the like component
function Like2({userData,postData}) {
    const [like,setLike] = useState(null);
    // checking whether user who is liking the post earlier liked it or not
    useEffect(() => {
        let check = postData.likes.includes(userData.userId) ? true : false;
        setLike(check);
    },[postData])

const handleLike = () => {
    // updating database
    // one click
    // like -> db update -> snapshot -> post data -> like useeffect executed again -> updated like state
    // if like status was true then now we have to remove the like of this user
    // we are filtering the posts therefore and updating the database of post likes
    if(like == true){
        let narr = postData.likes.filter((el) => el!=userData.userId);
        database.posts.doc(postData.postId).update({
            likes:narr
        })
    }
    // similarily if earlier like status was false then now this user is liking the post
    // therefore add this user to new array and update the database of post likes
    else{
        let narr = [...postData.likes,userData.userId]
        database.posts.doc(postData.postId).update({
            likes:narr
        })
    }
}
  return (
    <div>
        {
        like != null ?
        <>
        {
            // if liked then red heart icon or grey heart icon
            like == true ? <FavoriteIcon style={{padding:'1rem',paddingTop:'0.5rem'}} className={'like'} onClick={handleLike}/>: <FavoriteIcon className={'unlike2'} style={{padding:'1rem',paddingTop:'0.5rem'}} onClick={handleLike}/>
        }
        </> :
        <>

        </>
        }
    </div>
  )
}

export default Like2