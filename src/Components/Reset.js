// Below are the necessary imports
import React,{useContext,useState} from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../Context/AuthContext';
import insta from '../Assets/Instagram.JPG';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {useHistory} from 'react-router-dom';

// This component is being used for resetting password
function Reset() {
  
  // imported forget password functionality from the global store   
  const {forgetpasword} = useContext(AuthContext);  
  // email and setemail state default value is empty string
  const [email,setEmail] = useState('');
  // loading and setloading state default value is false
  // with the help of this state we will show loader in ui
  const [loading,setLoading] = useState(false);

  // This is one of the most popular hooks provided by React Router.
  //  It lets you access the history instance used by React Router. 
  // Using the history instance you can redirect users to another page
  const history = useHistory();

  
  // below function will work when user will provide their email for password resetting  
  const handleClick = async() => {
    try{
        setLoading(true);
        // passing email in ouur forget password functon
        let res = await forgetpasword(email);
        setLoading(false);
        alert("Check Your Mail");
        // after five seconds user will be redirected to feeds page
        setTimeout(() => {
            history.push('/');
        },5000)
    }catch(err){
        alert(err);
        setLoading(false);
    }
}

  return (
    <div className='signupWrapper'>
        <div className='signupCard'>
                            <Card varient = "outlined">
                                <div className="insta-logo">
                                    <img src={insta}/>
                                </div>
                                <CardContent>
                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin='dense' size='small' value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </CardContent>
                                <CardActions>
                                    <Button color='primary' fullWidth={true} variant='contained' onClick={handleClick} disabled={loading}>
                                        Submit
                                    </Button>
                                </CardActions>
                        </Card>
        </div>
    </div>
  )
}

export default Reset