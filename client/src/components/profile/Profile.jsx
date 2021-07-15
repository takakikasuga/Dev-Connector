import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../layout/Spiner';
import { getProfileById } from '../../actions/profile';

const Profile = () => {
  const { id } = useParams();
  console.log('params', id);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const loading = useSelector((state) => state.profile.loading);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [dispatch]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
