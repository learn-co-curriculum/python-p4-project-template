import unittest
from flask import Flask, json
from config import app, db
from models import User, Property, Visit, FavoriteProperty, Review

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        with app.app_context():
            db.create_all()
            # Create a test user
            test_user = User(username='testuser', email='testuser@example.com')
            test_user.set_password('password123')
            db.session.add(test_user)
            db.session.commit()
            self.test_user_id = test_user.id

            # Log in to get the JWT token
            response = self.app.post('/login', json={
                'username': 'testuser',
                'password': 'password123'
            })
            self.token = json.loads(response.data)['access_token']

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'<h1>Project Server</h1>')

    def test_register(self):
        response = self.app.post('/register', json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'User registered successfully!', response.data)

    def test_login(self):
        response = self.app.post('/login', json={
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'access_token', response.data)

    def test_create_property(self):
        response = self.app.post('/properties', json={
            'title': 'Test Property',
            'description': 'Test Description',
            'price': 100000,
            'address': '123 Test Street'
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Property created successfully!', response.data)

    def test_get_properties(self):
        response = self.app.get('/properties', headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)

    def test_create_visit(self):
        response = self.app.post('/visits', json={
            'property_id': 1,
            'scheduled_date': '2024-12-01T10:00:00'
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Visit scheduled successfully!', response.data)

    def test_create_favorite(self):
        response = self.app.post('/favorites', json={
            'property_id': 1
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Property added to favorites', response.data)

    def test_create_review(self):
        response = self.app.post('/reviews', json={
            'property_id': 1,
            'content': 'Great place!',
            'rating': 5
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Review added successfully', response.data)

if __name__ == '__main__':
    unittest.main()
