# Skill Trade Network

A peer-to-peer platform that enables people to exchange skills without money.


## Overview

Skill Trade Network is built around the idea of a **barter economy for knowledge**. Instead of paying for courses, users exchange skills directly with each other, creating meaningful connections and practical learning experiences.

The platform encourages collaboration, trust, and continuous engagement by allowing users to enter **active skill exchanges** rather than passively consuming content.


## Features

### Authentication
- Secure user signup and login using Firebase Authentication


### Skill Management (CRUD)
- Users can:
  - Add skills they offer
  - Add skills they want to learn
  - Update or edit their skills
  - Delete or remove skills
- Data is stored in Firestore

### Smart Matching
- Users can browse other users
- Basic matching logic:
  - Matches users based on complementary skills
- Example:
  - User A offers *React*, wants *Figma*
  - User B offers *Figma*, wants *React* - Match!


### Trade System
- Send trade requests
- Accept or reject incoming requests
- Track trade status:
  - `pending`
  - `accepted`
  - `completed`


### AI Integration
- Enhances user experience by:
  - Suggesting potential matches
- Makes the platform more intelligent and user-friendly


### Dashboard
- View:
  - Your skills
  - Incoming trade requests
  - Active exchanges

## Tech Stack

### Frontend
- React
- Tailwind CSS

### Backend / BaaS
- Firebase Authentication
- Firestore

### AI
- OpenAI API


## Live Demo
https://skills-trade-network.vercel.app/


## Running the Project Locally

Follow these steps to set up and run the project on your local machine.


### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- npm 
- Git


### 1. Clone the Repository

    git clone https://github.com/your-username/skill-trade-network.git
    cd skill-trade-network


### 2. Install Dependencies

Using npm:

    npm install



### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    VITE_OPENAI_API_KEY=your_openai_api_key

> Do not commit your `.env` file. Add it to `.gitignore`.

### 4. Setup Firebase

1. Go to Firebase Console  
2. Create a new project  
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database  
4. Copy your Firebase config into your project  


### 5. Run the Development Server

    npm run dev


### 6. Open in Browser

    http://localhost:5173


### 7. Test the App Flow

- Create an account  
- Add skills you offer and want  
- Browse other users  
- Send a trade request  
- Accept a request  

### Common Issues

**1. Firebase not working**
- Ensure config values are correct  
- Check if Authentication and Firestore are enabled  

**2. Environment variables not loading**
- Restart the dev server after editing `.env`  
- Ensure variables start with `VITE_`  

**3. API issues**
- Verify your OpenAI API key is valid  
- Check browser console for errors  

