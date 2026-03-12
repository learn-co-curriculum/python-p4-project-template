import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import CourseList from './CourseList';
import Footer from './Footer';

const Home = ({ courses }) => (
  <main className="home-page">
    <Header title="LetsStudy!" subtitle="Find study groups by course" />
    <CourseList courses={courses} />
    <Footer />
  </main>
);

Home.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object),
};

Home.defaultProps = {
  courses: [],
};

export default Home;
