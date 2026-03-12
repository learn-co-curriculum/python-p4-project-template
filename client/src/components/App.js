import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';

const mockCourses = [
  { courseId: 1, courseName: 'Intro to Algorithms' },
  { courseId: 2, courseName: 'Databases 101' },
];

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home courses={mockCourses} />
      </Route>
    </Switch>
  </Router>
);

export default App;
}
 

export default App;
