#!/usr/bin/env python3

# Standard library imports

# Local imports
from config import app, api

# Import models so SQLAlchemy registers them
import models
from routes.courses import (
    CourseListResource,
    CourseResource,
    CourseStudyGroupResource,
)


# Register API resources
api.add_resource(CourseListResource, '/courses')
api.add_resource(CourseResource, '/courses/<int:course_id>')
api.add_resource(CourseStudyGroupResource, '/courses/<int:course_id>/study-groups')


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


# touch models to ensure they are imported during startup (no-op)
app.logger.debug('models loaded: %d symbols', len(dir(models)))


if __name__ == '__main__':
    app.run(port=5555, debug=True)
