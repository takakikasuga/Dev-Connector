import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if (localStorage.token) {
  console.log('App.tsxのlocalStorage.token');
  setAuthToken(localStorage.token);
}

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing}></Route>
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register}></Route>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/profiles' component={Profiles}></Route>
            <Route exact path='/profile/:id' component={Profile}></Route>
            <PrivateRoute
              exact
              path='/dashboard'
              component={Dashboard}></PrivateRoute>
            <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}></PrivateRoute>
            <PrivateRoute
              exact
              path='/edit-profile'
              component={EditProfile}></PrivateRoute>
            <PrivateRoute
              exact
              path='/add-experience'
              component={AddExperience}></PrivateRoute>
            <PrivateRoute
              exact
              path='/add-education'
              component={AddEducation}></PrivateRoute>
            <PrivateRoute exact path='/posts' component={Posts}></PrivateRoute>
            <PrivateRoute
              exact
              path='/posts/:id'
              component={Post}></PrivateRoute>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};
export default App;
