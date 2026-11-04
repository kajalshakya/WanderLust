# WanderLust – Travel & Stay Booking Platform

WanderLust is a full-stack travel and accommodation listing web application inspired by Airbnb. It allows users to explore different destinations, create accommodation listings, upload property images, and share their experiences through reviews and ratings.

The application provides user authentication, listing management, image uploads, location-based search, category filtering, review management, and legal information pages.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [MVC Architecture](#mvc-architecture)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Application Routes](#application-routes)
- [How the Application Works](#how-the-application-works)
- [Future Enhancements](#future-enhancements)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

WanderLust is designed to make discovering and sharing travel accommodations easier.

Users can browse available properties, search for destinations, filter listings by categories, and view detailed information about each property.

Registered users can create their own listings, upload property images, edit or delete their listings, and post reviews with ratings.

The project follows the **MVC (Model-View-Controller) architecture**, making the application structured, modular, and easier to maintain.

---

## Features

### 1. User Authentication

- User registration and login.
- Secure password-based authentication using Passport.js.
- User logout functionality.
- Session-based authentication.
- Flash messages for success and error notifications.

### 2. Listing Management (CRUD)

- View all available listings.
- Create new accommodation listings.
- View detailed information about a listing.
- Edit existing listings.
- Delete listings.
- Associate listings with their respective owners.

### 3. Image Upload

- Upload property images using Multer.
- Store uploaded images using Cloudinary.
- Display images on listing cards and detail pages.

### 4. Search and Category Filtering

- Search listings by title, location, and country.
- Filter listings using different categories.
- Explore properties based on travel preferences.

### 5. Reviews and Ratings

- Add reviews to listings.
- Provide ratings between 1 and 5.
- Display reviews along with author information.
- Delete reviews.
- Automatically remove associated reviews when a listing is deleted.

### 6. Location and Map Integration

- Integrate Mapbox Geocoding API.
- Convert property locations into geographical coordinates.
- Store geographical coordinates in MongoDB.
- Support location-based map functionality.

### 7. Authorization

- Restrict listing creation to authenticated users.
- Allow only listing owners to edit or delete their listings.
- Restrict review deletion to authorized users.
- Protect application routes using custom middleware.

### 8. Responsive User Interface

- Responsive design using Bootstrap.
- Clean and user-friendly navigation.
- Property cards with images and details.
- Mobile-friendly layouts.

### 9. Privacy Policy and Terms & Conditions

- Dedicated Privacy Policy page.
- Dedicated Terms & Conditions page.
- Information about user data collection and usage.
- Details about user responsibilities and website usage.
- Accessible through footer links.
- Responsive styling for legal information pages.

---

## Technologies Used

| Category | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript, Bootstrap |
| Template Engine | EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | Passport.js, Passport Local Mongoose |
| Session Management | Express Session |
| Image Upload | Multer |
| Image Storage | Cloudinary |
| Geocoding | Mapbox API |
| Flash Messages | Connect Flash |
| Validation | Joi |
| Version Control | Git and GitHub |

---

## MVC Architecture

WanderLust follows the **MVC (Model-View-Controller)** architecture to organize the application into three parts:

- **Model:** Manages database schemas and data using Mongoose.
- **View:** Handles the user interface using EJS templates.
- **Controller:** Handles application logic and connects Models with Views.

This separation makes the code easier to manage, understand, and maintain.

---

## Project Structure

```text
WanderLust/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   ├── show.ejs
│   │   ├── privacy.ejs
│   │   └── terms.ejs
│   │
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   └── error.ejs
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   │
│   ├── js/
│   │   ├── map.js
│   │   └── script.js
│   │
│   └── images/
│       └── compass.png
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── init/
│   ├── data.js
│   └── index.js
│
├── .env
├── .gitignore
├── middleware.js
├── cloudConfig.js
├── schema.js
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation and Setup

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/kajalshakya/WanderLust.git
```

### Step 2: Navigate to the Project Directory

```bash
cd WanderLust
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory and add the required environment variables.

```env
MAP_TOKEN=your_mapbox_token

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

ATLASDB_URL=your_mongodb_atlas_connection_string

SECRET=your_session_secret
```

**Note:** Use the exact environment variable names referenced in your `app.js` and `cloudConfig.js` files. Never upload your `.env` file or API secrets to GitHub.

### Step 5: Configure MongoDB

Make sure your MongoDB server is running locally, or configure your MongoDB Atlas connection.

### Step 6: Run the Application

```bash
node app.js
```

For development with Nodemon:

```bash
npx nodemon app.js
```

### Step 7: Open in Browser

```text
http://localhost:3000/listings
```

---

## Environment Variables

The application uses environment variables to securely manage API credentials and database connections.

| Variable | Purpose |
|---|---|
| MAP_TOKEN | Mapbox API access token |
| CLOUD_NAME | Cloudinary cloud name |
| CLOUD_API_KEY | Cloudinary API key |
| CLOUD_API_SECRET | Cloudinary API secret |
| ATLASDB_URL | MongoDB Atlas connection string |
| SECRET | Express session secret |

---

## Database

WanderLust uses MongoDB as its database and Mongoose as its Object Data Modeling (ODM) library.

The application contains three main collections:

| Collection | Description |
|---|---|
| Users | Stores registered user information. |
| Listings | Stores property details, images, location, price, and ownership. |
| Reviews | Stores user comments, ratings, and author references. |

**Relationships:**

- A user can create multiple listings.
- A listing belongs to one owner.
- A listing can contain multiple reviews.
- Each review is associated with an author.
- Reviews are removed when their associated listing is deleted.

---

## Application Routes

### Listing Routes

| Method | Route | Description |
|---|---|---|
| GET | `/listings` | Display all listings |
| GET | `/listings/new` | Render new listing form |
| POST | `/listings` | Create a new listing |
| GET | `/listings/:id` | Display listing details |
| GET | `/listings/:id/edit` | Render edit form |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |

### User Routes

| Method | Route | Description |
|---|---|---|
| GET | `/signup` | Render signup form |
| POST | `/signup` | Register a new user |
| GET | `/login` | Render login form |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Logout user |

### Review Routes

| Method | Route | Description |
|---|---|---|
| POST | `/listings/:id/reviews` | Create a review |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review |

### Static Pages

| Method | Route | Description |
|---|---|---|
| GET | `/privacy` | Display Privacy Policy |
| GET | `/terms` | Display Terms & Conditions |

---

## How the Application Works

1. A user visits the WanderLust website and browses available accommodation listings.
2. Users can search for destinations or filter listings by category.
3. To create a listing or submit a review, users must register or log in.
4. Authenticated users can create listings by providing property details and uploading images.
5. Uploaded images are stored on Cloudinary.
6. Mapbox Geocoding API converts the entered location into geographical coordinates.
7. Listing information is stored in MongoDB.
8. Users can view listing details and read reviews posted by other users.
9. Listing owners can edit or delete their own listings.
10. Authorized users can manage reviews according to the application's access rules.
11. Users can access the Privacy Policy and Terms & Conditions pages through the website footer.

---

## Future Enhancements

Some features that can be added in future versions:

- Online booking and reservation system.
- Payment gateway integration.
- Wishlist and favorite listings.
- Advanced search with price and location filters.
- User profile management.
- Email notifications.
- Improved map-based property discovery.

---

## Author

**Kajal Shakya**

MCA Student | Full Stack Web Development

- GitHub: [@kajalshakya](https://github.com/kajalshakya)

---

## Acknowledgements

This project was developed as a learning project to understand full-stack web development, RESTful routing, MVC architecture, database relationships, authentication, authorization, and third-party API integration.

If you find this project interesting, consider giving it a star on GitHub.