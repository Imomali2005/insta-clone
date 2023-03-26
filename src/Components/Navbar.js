// Below are some mecessary imports
import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import insta from '../Assets/Instagram.JPG';
import HomeIcon from '@material-ui/icons/Home';
import Avatar from '@mui/material/Avatar';
import ExploreIcon from '@material-ui/icons/Explore';


// makeStyles is a function from Material-UI that allows us to create 
// CSS classes and rules using JavaScript objects. The makeStyles function 
// returns a React hook that we can use in a functional component to access the styles and classes. 
// Then, we can apply these styles to any element in our component.
const useStyles = makeStyles((theme) => ({
  appb: {
    background : 'white'
  },
  appbb:{
    marginRight:'1.5rem',
    height:'2.2rem',
    width:'2.2rem',
    cursor:'pointer'
  },
  appbbb:{
    marginRight:'1rem',
    height:'2.2rem',
    width:'2.2rem',
    cursor:'pointer'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    color:'black',
    alignItems:'center',
    marginRight:'4rem',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    color:'black',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));


// It is the navbar component which contains instagrm logo and link to profile page and logout option
export default function Navbar({userData}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const history = useHistory();
  const {logout} = React.useContext(AuthContext);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // personalised profile management redirection
  const handleProfile = () => {
    history.push(`/profile/${userData.userId}`)
  };

  // return to feed page
  const handlebannerclick = () => {
      history.push('/')
  }

  // logout simply if clicked
  const handlelogout = async() => {
    await logout();
    history.push('/login')
  }

  
  const handleexplore = () => {
      let win = window.open('_blank');
      win.focus();
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}><AccountCircleIcon/><p>&nbsp;&nbsp;</p>Profile</MenuItem>
      <MenuItem onClick={handlelogout}><ExitToAppIcon/><p>&nbsp;&nbsp;</p>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfile}><AccountCircleIcon/><p>&nbsp;&nbsp;</p>Profile</MenuItem>
      <MenuItem onClick={handlelogout}><ExitToAppIcon/><p>&nbsp;&nbsp;</p>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appb} sx={{background:'white'}}>
        <Toolbar>
         <div style={{marginLeft:'5%'}}>
            <img src={insta} style={{width:'20vh'}} onClick={handlebannerclick}/>
         </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            
            <HomeIcon onClick={handlebannerclick} className={classes.appbb}/>
            <ExploreIcon onClick={handleexplore} className={classes.appbbb}/>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={userData.profileUrl}  sx={{height:'2.2rem',width:'2.2rem'}}/>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>


            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
