# JamboStays Property Rental Platform

A full-stack property rental platform built with React and Flask, designed for seamless property booking experiences with role-based access for property owners and guests.

## 🏗 Architecture

### Frontend (React)
- **Framework**: React 18 with React Router for navigation
- **Styling**: Tailwind CSS with custom luxury-themed CSS
- **Forms**: Formik with Yup validation
- **State Management**: React Context for authentication
- **UI Components**: shadcn/ui components with Lucide icons
- **HTTP Client**: Axios for API communication

### Backend (Flask)
- **Framework**: Flask with Flask-RESTful
- **Database**: SQLAlchemy ORM with SQLite
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **File Upload**: Werkzeug secure file handling
- **CORS**: Flask-CORS for cross-origin requests
- **Password Security**: Werkzeug password hashing

## 📋 Features

### Authentication & User Management
- User registration and login with JWT tokens
- Role-based access (Property Owner / Guest)
- Protected routes and API endpoints
- User profile management

### Property Management (Owners)
- Add, edit, and delete properties
- Multiple image upload (file upload & URL support)
- Property analytics and booking statistics
- Revenue tracking

### Property Booking (Guests)
- Browse available properties
- Real-time price calculation
- Date-based availability checking
- Booking history and management
- Booking cancellation

### Additional Features
- Property favorites system
- Advanced search and filtering
- Responsive design for all devices
- Property image galleries
- Owner-guest communication interface

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Clone the repository
```bash
git clone <repository-url>
cd luxury-property-rental
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies
```bash
pip install flask flask-restful flask-sqlalchemy flask-migrate flask-jwt-extended flask-cors sqlalchemy-serializer faker werkzeug
```

4. Set up the database
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Seed the database (optional)
```bash
python seed.py
```

6. Run the Flask server
```bash
python app.py
```
Server runs on `http://localhost:5555`

### Frontend Setup
1. Navigate to frontend directory
```bash
cd client  # Adjust path as needed
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```
Application runs on `http://localhost:3000`

## 📁 Project Structure

```
luxury-property-rental/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # App configuration
│   ├── models.py           # Database models
│   ├── seed.py             # Database seeding script
│   └── uploads/            # File upload directory
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── App.js
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── PropertyCard.js
│   │   │   ├── BookingForm.js
│   │   │   └── OwnerForm.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── PropertyDetails.js
│   │   │   ├── OwnerDashboard.js
│   │   │   ├── UserDashboard.js
│   │   │   └── AuthPage.js
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   └── styles/         # CSS files
│   └── public/
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/verify` - Token verification
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/<id>` - Get specific property
- `POST /api/properties` - Create property (Owner only)
- `PATCH /api/properties/<id>` - Update property (Owner only)
- `DELETE /api/properties/<id>` - Delete property (Owner only)
- `POST /api/properties/available` - Check availability

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking (Authenticated)
- `GET /api/user/bookings` - Get user's bookings
- `GET /api/owner/bookings` - Get owner's property bookings
- `PUT /api/bookings/<id>/cancel` - Cancel booking

### Favorites
- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/favorites` - Add to favorites
- `DELETE /api/user/favorites/<property_id>` - Remove from favorites

### File Upload
- `POST /api/properties/<id>/images` - Upload property images
- `POST /api/properties/<id>/images/url` - Add image by URL
- `DELETE /api/properties/images/<id>` - Delete property image

## 🎨 UI Components

### Key Components
- **PropertyCard**: Reusable property display card with hover effects
- **BookingForm**: Dynamic booking form with price calculation
- **Dashboard**: Separate interfaces for owners and guests
- **AuthPage**: Combined login/registration form
- **Navbar**: Responsive navigation with role-based links

### Styling Features
- Luxury hotel theme with elegant color scheme
- Smooth animations and transitions
- Mobile-responsive design
- Glass morphism effects
- Gradient backgrounds

## 🗄 Database Models

### User
- id, email, password_hash, name, user_type, created_at

### Owner
- id, name, email, phone, created_at
- Relationships: properties (one-to-many)

### Property
- id, name, description, location, price_per_night, max_guests, amenities, owner_id, created_at
- Relationships: owner (many-to-one), bookings (one-to-many), images (one-to-many)

### Booking
- id, property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, booking_status, created_at
- Relationships: property (many-to-one)

### PropertyImage
- id, property_id, image_url, image_name, is_featured, upload_order, created_at
- Relationships: property (many-to-one)

### Favorite
- id, user_id, property_id, created_at
- Relationships: user (many-to-one), property (many-to-one)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with Werkzeug
- Role-based access control
- CORS configuration
- SQL injection prevention through SQLAlchemy ORM
- File upload security with filename sanitization

## 🚀 Future Enhancements

### High Priority Issues
1. **Email Notifications**: Implement email service for booking confirmations
   - Set up SMTP configuration
   - Create email templates for booking confirmations
   - Add email notifications for booking status changes

2. **Favorites Bug Fix**: Resolve issue where favorites show all properties instead of user-specific favorites
   - Debug favorites filtering logic
   - Ensure proper user-property relationship querying

### Planned Features
- Real-time chat between owners and guests
- Payment gateway integration (Stripe/PayPal)
- Review and rating system
- Advanced property search filters
- Calendar integration for availability
- Mobile app development
- Multi-language support
- Property recommendations AI
- Booking reminders and notifications
- Social media integration
- Advanced analytics dashboard
- Automated pricing suggestions
- Integration with external calendar systems

### Technical Improvements
- Unit and integration testing
- Docker containerization
- Cloud deployment (AWS/Digital Ocean)
- Database optimization and indexing
- Image optimization and CDN integration
- Caching implementation (Redis)
- API rate limiting
- Logging and monitoring setup
- Backup and disaster recovery

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please contact: juliuskedienye61@gmail.com,fuchakamichael06@gmail.com, bonfasogaro@gmail.com

## 🙏 Acknowledgments

- Unsplash for property images
- shadcn/ui for component library
- Tailwind CSS for styling framework
- Flask community for excellent documentation

