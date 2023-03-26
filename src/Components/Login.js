// Below are the necessary imports
import * as React from 'react';
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
import './Login.css'
import insta from '../Assets/Instagram.JPG'
import bg from '../Assets/insta.png'
import {Link, useHistory} from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext,Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import img1 from '../Assets/img1.jpg';
import img2 from '../Assets/img2.jpg';
import img3 from '../Assets/img3.jpg';
import img4 from '../Assets/img4.jpg';
import img5 from '../Assets/img5.jpg';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { async } from '@firebase/util';


// In this componenet we have implemented login functionality
export default function Login() {
    // we have defined all the function related to firebase authentication in a global store which we have imported here
    // “useContext” hook is used to create common data that can be accessed 
    // throughout the component hierarchy without passing the props down manually to each level. 
    // Context defined will be available to all the child components without involving “props”.
    const store = useContext(AuthContext);
    // console.log(store)
    
    // makeStyles is a function from Material-UI that allows us to create 
    // CSS classes and rules using JavaScript objects. The makeStyles function 
    // returns a React hook that we can use in a functional component to access the styles and classes. 
    // Then, we can apply these styles to any element in our component.
    const useStyles = makeStyles({
        text1:{
            color:'grey',
            textAlign:'center'
        },
        text2:{
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

    // email and setemail state for login purpose default value is empty string
    const [email,setEmail] = useState('');
    // password and setpassword state default value is empty string
    const [password,setPassword] = useState('');
    // error and seterror state default value is empty string
    // with the help of this state we will display any error in ui
    const [error,setError] = useState('');
    // loading and setloading state default value is false
    // with the help of this state we will show loader in ui
    const [loading,setLoading] = useState(false);

    // imported login function from the global store
    const {login} = useContext(AuthContext);

    // This is one of the most popular hooks provided by React Router.
    //  It lets you access the history instance used by React Router. 
    // Using the history instance you can redirect users to another page
    const history = useHistory();

    // Below is the function which will be active when user will log in
    const handleClick = async() => {
        try{
            // Now here we will pass email and password for login purpose
            setError('');
            setLoading(true);
            let res = await login(email,password);
            // if login successful then user will be directed to feeds page
            setLoading(false);
            history.push('/');
        }catch(err){
            // If there is any error then it will be shown to user
            setError(err);
            setTimeout(() => {
                setError('');
            },2000)
            setLoading(false);
        }
    }

    // we have option to forget password below function is for redirecting user to reset password page
    const handleForget = () => {
        history.push('/reset');
    }

  return (
      <div className='loginWrapper'>
        <div className='imgcar' style={{backgroundImage:'url('+bg+')',backgroundSize:'cover'}}>
            <div className='car'>
            {/* Carousel Component provides a way to create a slideshow for our images or text slides with a present full manner in a cyclic way. We can use the following approach in ReactJS to use the react-bootstrap Carousel Component. 
            // Carousel Props: activeIndex: It is used to control the current active visible slide. */}
            {/* With the help of this carousel provider only we have implemented beautiful sliding image feature */}
                        <CarouselProvider
                        // There are some necesaary attributes
                            naturalSlideWidth={238}
                            naturalSlideHeight={423}
                            totalSlides={5}
                            visibleSlides={1}
                            hasMasterSpinner
                            isPlaying={true}
                            infinite={true}
                            dragEnabled={false}
                            touchEnabled={false}
                            >

                            {/* we have created five slides */}
                            <Slider>
                            <Slide index={0}><Image src={img1}/></Slide>
                            <Slide index={1}><Image src={img2}/></Slide>
                            <Slide index={2}><Image src={img3}/></Slide>
                            <Slide index={3}><Image src={img4}/></Slide>
                            <Slide index={4}><Image src={img5}/></Slide>
                            </Slider>
                        </CarouselProvider>
            </div>
        </div>
          <div className='loginCard'>
                        <Card varient = "outlined">
                            <div className="insta-logo">
                                {/* image stored in the assets folder imported as insta */}
                                <img src={insta}/>
                            </div>
                            <CardContent>
                                {/* if there is some error we will display in alert or else flow will continue */}
                                {error != '' && <Alert severity="error">{error}</Alert>}
                                {/* Below is the input text field for email, through which we are updating email state with the help of setemail function */}
                                <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin='dense' size='small' value={email} onChange={(e) => setEmail(e.target.value)}/>
                                {/* Below is the input text field for password, through which we are updating password state with the help of setpassword function */}
                                <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin='dense' size='small' value={password} onChange={(e) => setPassword(e.target.value)}/>
                                {/* If user forgot the password then forget password functionality is there */}
                                <Typography className={classes.text2} color="primary" variant="subtitle1" onClick={handleForget}>
                                    Forget Password ?
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {/* Finally user can login by pressing below login button */}
                                <Button color='primary' fullWidth={true} variant='contained' onClick={handleClick} disabled={loading}>
                                    Login
                                </Button>
                            </CardActions>
                    </Card>
                    {/* If user does not have account then redirect to sign up page */}
                    <Card variant='outlined' className={classes.card2}>
                                <Typography className={classes.text1} variant="subtitle1" marginTop='none'>
                                    Don't Have an account ? <Link to="/signup"style={{textDecoration:'none'}}>SignUp</Link>
                                </Typography>
                    </Card>
          </div>
      </div>
  );
}