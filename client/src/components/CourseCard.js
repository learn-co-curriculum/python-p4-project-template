import React from 'react';
import PropTypes from 'prop-types';

const CourseCard = ({ courseName, courseId, ...rest }) => (
  <article className="course-card" {...rest}>
    <h3>{courseName}</h3>
    <p className="course-id">ID: {courseId}</p>
  </article>
);

CourseCard.propTypes = {
  courseName: PropTypes.string.isRequired,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CourseCard;
