import logo from './logo.svg';
import './App.css';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Feed from './Components/Feed';

import {BrowserRouter, Switch,Route} from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';

import PrivateRoute from './Components/PrivateRoute'
import Reset from './Components/Reset';



import Profile from './Components/Profile'

function App() {
  return (
    // BrowserRouter: BrowserRouter is a router implementation that uses the HTML5 history API(pushState, replaceState and the popstate event) to keep your UI in sync with the URL. 
    // It is the parent component that is used to store all of the other components.
    <BrowserRouter>
      <AuthProvider>
        {/* The switch component looks through all of its child routes and it 
        displays the first one whose path matches the current URL. T
        his component is what we want to use in most cases for most applications, 
        because we have multiple routes and 
        multiple plate pages in our app but we only want to show one page at a time. */}
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={SignUp}/>
          <Route path="/reset" component={Reset}/>
          {/* profile and feeds are protected by prvate route no one can access them without login or signup */}
          <PrivateRoute path="/profile/:id" component={Profile}/>
          {/* id for every user it will work */}
          <PrivateRoute path="/" component={Feed}/>
        </Switch>
        </AuthProvider>
    </BrowserRouter>
    // <Ioa/>
    
  );
}

export default App;
