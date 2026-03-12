from flask import request
from flask_restful import Resource

from models import Course, StudyGroup, User, db


class CourseListResource(Resource):
    def get(self):
        courses = Course.query.order_by(Course.course_name).all()
        return [c.to_dict() for c in courses], 200

    def post(self):
        payload = request.get_json() or {}
        name = payload.get('course_name')
        if not name:
            return {'error': 'course_name is required'}, 400

        existing = Course.query.filter_by(course_name=name).first()
        if existing:
            return {'error': 'course already exists'}, 409

        course = Course(course_name=name)
        db.session.add(course)
        db.session.commit()
        return course.to_dict(), 201


class CourseResource(Resource):
    def get(self, course_id):
        course = Course.query.get_or_404(course_id)
        return course.to_dict(), 200

    def patch(self, course_id):
        course = Course.query.get_or_404(course_id)
        payload = request.get_json() or {}
        name = payload.get('course_name')
        if name:
            course.course_name = name
            db.session.commit()
        return course.to_dict(), 200

    def delete(self, course_id):
        course = Course.query.get_or_404(course_id)
        db.session.delete(course)
        db.session.commit()
        return {'message': 'deleted'}, 204


class CourseStudyGroupResource(Resource):
    """Create study groups under a course (lecturer/admin flow).

    Expected payload: { name, owner_user_id, start_date?, end_date? }
    """
    def post(self, course_id):
        course = Course.query.get_or_404(course_id)
        payload = request.get_json() or {}
        name = payload.get('name')
        owner_user_id = payload.get('owner_user_id')
        if not name or not owner_user_id:
            return {'error': 'name and owner_user_id are required'}, 400

        # Ensure owner exists and is a lecturer (basic check)
        owner = User.query.get(owner_user_id)
        if not owner:
            return {'error': 'owner user not found'}, 404
        if owner.user_category.lower() != 'lecturer':
            return {'error': 'only lecturers can create study groups'}, 403

        sg = StudyGroup(
            name=name,
            course_ID=course.course_ID,
            owner_user_id=owner.user_ID,
        )
        db.session.add(sg)
        db.session.commit()

        return sg.to_dict(), 201
