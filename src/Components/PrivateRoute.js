import React, {useContext} from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

// Private Routes in React Router (also called Protected Routes)
//  require a user being authorized to visit a route (read: page). 
// So if a user is not authorized for a specific page, they cannot access it.
function PrivateRoute({component:Component,...rest}) {
  const {user} = useContext(AuthContext);
  return (
    <Route {...rest} render={props => {
      // if user is valid then access or else redirect to login page
        return user?<Component {...props}/> : <Redirect to="login"/>
    }}/>
  )
}

export default PrivateRoute