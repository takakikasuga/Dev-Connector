import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spiner';
import PostItem from './PostItem';
import PostForm from './PostForm';

import { getPosts } from '../../actions/post';

const Posts = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.post.loading);
  const posts = useSelector((state) => state.post.posts);
  const post = useSelector((state) => state.post);
  console.log('post', post);
  console.log('posts', posts);

  useEffect(() => {
    dispatch(getPosts());
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community!
      </p>
      <PostForm></PostForm>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </Fragment>
  );
};

export default Posts;
