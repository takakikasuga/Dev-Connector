import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spiner';
import { getPosts } from '../../actions/post';

const Posts = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.post.loading);
  const GET_POSTS = useSelector((state) => state.post.GET_POSTS);

  useEffect(() => {
    dispatch(getPosts());
  }, []);
  return <div></div>;
};

export default Posts;
