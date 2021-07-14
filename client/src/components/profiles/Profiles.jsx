import React, { Fragment, useEffect } from 'react';
import Spinner from '../layout/Spiner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import { useDispatch, useSelector } from 'react-redux';

const Profiles = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profile.loading);
  const profiles = useSelector((state) => state.profile.profiles);
  useEffect(() => {
    dispatch(getProfiles());
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and connect with
            developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile}></ProfileItem>
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profiles;
