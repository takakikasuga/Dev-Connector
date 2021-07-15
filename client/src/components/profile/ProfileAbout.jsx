import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name, avatar }
  }
}) => {
  return (
    //  < !--About -->
    <div class='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          <h2 class='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
          <p>{bio}</p>
          <div class='line'></div>
        </Fragment>
      )}

      <h2 class='text-primary'>Skill Set</h2>
      <div class='skills'>
        {skills.map((skill, index) => {
          return (
            <div class='p-1' key={index}>
              <i class='fas fa-check'></i> {skill}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileAbout;
