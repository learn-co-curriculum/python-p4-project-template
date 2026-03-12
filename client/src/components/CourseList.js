import React from 'react';
import PropTypes from 'prop-types';
import CourseCard from './CourseCard';

const CourseList = ({ courses = [] }) => (
  <section className="course-list">
    {courses.map((c) => (
      <CourseCard key={c.courseId} {...c} />
    ))}
  </section>
);

CourseList.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object),
};

export default CourseList;
