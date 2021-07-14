import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormDate] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [toDateDisabled, toggleDisabled] = useState(false);
  const { school, degree, fieldofstudy, from, to, current, description } =
    formData;
  const onChange = (e) => {
    setFormDate({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <h1 class='large text-primary'>Add Your Education</h1>
      <p class='lead'>
        <i class='fas fa-code-branch'></i> Add any school or bootcamp that you
        have attended
      </p>
      <small>* = required field</small>
      <form
        class='form'
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(addEducation(formData, history));
        }}>
        <div class='form-group'>
          <input
            type='text'
            placeholder='school or bootcamp'
            name='school'
            required
            value={school}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div class='form-group'>
          <input
            type='text'
            placeholder='degree or certificate'
            name='degree'
            required
            value={degree}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div class='form-group'>
          <input
            type='text'
            placeholder='Field of Study'
            name='fieldofstudy'
            value={fieldofstudy}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div class='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div class='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              value={current}
              checked={current}
              onChange={() => {
                setFormDate({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
            />{' '}
            Current Job
          </p>
        </div>
        <div class='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={(e) => {
              onChange(e);
            }}
            disabled={toDateDisabled ? 'disabled' : ''}
          />
        </div>
        <div class='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
            value={description}
            onChange={(e) => {
              onChange(e);
            }}></textarea>
        </div>
        <input type='submit' class='btn btn-primary my-1' />
        <a class='btn btn-light my-1' href='dashboard.html'>
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

export default AddEducation;
