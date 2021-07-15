import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CREAR_PROFILE,
  ACCOUNT_DERETED,
  GET_REPOS
} from './types';

//  Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');
    console.log('getCurrentProfile/res.data', res.data);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    console.log('getCurrentProfile/err', err.response);
    // Add this
    dispatch({ type: CREAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Get all profile
export const getProfiles = () => async (dispatch) => {
  // 先に既存をプロファイルをからにする
  dispatch({ type: CREAR_PROFILE });
  try {
    const res = await axios.get('/api/profile');
    console.log('getProfiles/res.data', res.data);
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    console.log('getCurrentProfile/err', err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    console.log('getProfileById/res.data', res.data);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    console.log('getCurrentProfile/err', err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    console.log('getGithubRepos/res.data', res.data);
    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    console.log('getCurrentProfile/err', err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or Update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    console.log('history', history);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      };

      const res = await axios.post('/api/profile', formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
      // 編集もしくは作成に応じてメッセージを出し分ける
      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      );

      if (!edit) {
        history.push('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;
      console.log('errors', errors);
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      console.log('createProfile/err', err.response);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

// 経験の追加
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/experience', formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    // 編集もしくは作成に応じてメッセージを出し分ける
    dispatch(setAlert('Experience added', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;
    console.log('errors', errors);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    console.log('createProfile/err', err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// 教育経験の追加
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/education', formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    // 編集もしくは作成に応じてメッセージを出し分ける
    dispatch(setAlert('Education added', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;
    console.log('errors', errors);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    console.log('createProfile/err', err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure?? This can Not be undone!')) {
    try {
      await axios.delete('/api/profile/');
      dispatch({
        type: CREAR_PROFILE
      });
      dispatch({
        type: ACCOUNT_DERETED
      });

      dispatch(setAlert('Your Account  has been deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
