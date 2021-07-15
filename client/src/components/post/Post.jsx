import React, { Fragment, useEffect } from 'react';
import Spinner from '../layout/Spiner';
import PostItem from '../posts/PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from '../../actions/post';
import { Link, useParams } from 'react-router-dom';

const Post = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log('id', id, ' useParams()', useParams());
  const loading = useSelector((state) => state.post.loading);
  const post = useSelector((state) => state.post.post);

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
    </Fragment>
  );
};

export default Post;
