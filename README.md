# Galactic Explorers | Back-End Web Development CA2 (Full-Stack Web Gamified Fitness Tracker) 🚀

## Author: Balamurugan Siddhartha
**Class:** DAAA/FT/1B/07  
**Admin No.:** P2404312

---

## 📌 Project Overview
Galactic Explorers is a full-stack gamified fitness tracking web application designed to encourage users to complete fitness challenges, explore planets, and engage with an interactive leaderboard system. Users can create, attempt, and complete fitness challenges while earning skill points, which can be spent in the Galactic Marketplace to purchase items required for space exploration. Additionally, users can join or create guilds, participate in real-time guild chat, and compete on the Guild Leaderboard, which ranks guilds based on the total number of planets explored by their members.

The application is built using **Node.js, Express.js, MySQL, Bcrypt and JWT authentication** for secure user management and password hashing. The frontend is powered by **HTML, CSS, JavaScript, and Bootstrap**, ensuring a smooth and engaging user experience!

---

## 🎬 Demo Video
📽️ A full walkthrough of Galactic Explorers is available in the **demo video**, showcasing all major features and functionality made by me, please click to watch!

[![Watch on YouTube](https://img.youtube.com/vi/8UEGH_wizP4/maxresdefault.jpg)](https://youtu.be/8UEGH_wizP4)


---

## 🏗️ Entity Relationship Diagram (ERD)
Below is the **Entity Relationship Diagram (ERD)** representing the database structure of Galactic Explorers (BED CA2):

![ERD Image](https://i.postimg.cc/13VH4mJw/Untitled-2.png)


---

## ⚙️ Environment Variables (.env)

To run on your end, modify my `.env`:

- Change `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_DATABASE` based on your MySQL setup.

The following environment variables were used in my project:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=ca2db

JWT_SECRET_KEY=galactic-explorers-fitness-tracker
JWT_EXPIRES_IN=15m
JWT_ALGORITHM=HS256

JWT_REFRESH_SECRET_KEY=galactic-explorers-fitness-tracker-refresh
JWT_REFRESH_EXPIRES_IN=3d
```

---


## 🚀 Running the Project

### **1️⃣ Install Dependencies**
Since the `node_modules` folder is removed, install the required dependencies first:
```sh
npm install
```

### **2️⃣ Initialize the Database**
Before starting the server, ensure that the database tables are properly set up:
```sh
npm run init_tables
```

### **3️⃣ Start the Development Server**
To run the project in development mode with `nodemon`:
```sh
npm run dev
```

This will automatically restart the server when changes are made.

---

## 🎯 Features Implemented

### 🔹 **Fitness Challenges**
- Users can **create, edit, and delete** fitness challenges.
- Users can attempt and complete challenges, earning skill points upon successful completion or a small fraction (5 Skill Points) for attempting.
- Completion records are stored and displayed for tracking progress, allowing users to see other people's notes and whether they attempted or completed a challenge.

### 🔹 **Guild System**
- Users can **create, join, and leave** guilds.
- Each user can create only **one** guild and join only **one** guild to promote loyalty.
- **Guild leaders** are highlighted with a **holographic gradient badge**.
- Users who create a challenge also receive a **holographic badge** on their challenge card.
- Members can chat in **real-time** within their guild (Galactic Guild Chat).
- **Guild Leaderboard** ranks guilds based on **total planets explored**, encouraging users to **rank up and bring glory to their guild!**

### 🔹 **User Leaderboard**
- A **global leaderboard** ranks individual users based on their total number of planets explored.
- Users compete to become the **top explorer** in the gamified fitness tracker.
- Encourages friendly competition and engagement and also the drive for people to stay fit by doing more fitness challenges!

### 🔹 **Galactic Exploration**
- Users can explore planets using **items purchased from the marketplace**.
- Successfully exploring planets grants **additional skill points**.
- Dynamic **exploration logs** track user progress.

### 🔹 **Marketplace & Inventory System**
- Users can **buy and sell items** in the **Galactic Marketplace**.
- Inventory management ensures items are tracked properly.
- Required items are checked before allowing exploration of certain planets.

### 🔹 **User Authentication & Security**
- **JWT authentication** with refresh tokens for secure session management.
- Passwords are **hashed** using **bcrypt** for security.
- API endpoints are protected with **middleware validation**.
- **Password strength checker** for account registration.
- **Eye icon toggle** for password visibility in login and register forms.

### 🔹 **Reviews & Ratings System**
- Users can **rate and review** challenges.
- Reviews can be **sorted and filtered** by rating and challenge.
- Challenge creators can view feedback to improve their challenges.

### 🔹 **Dynamic UI Enhancements**
- **Live updates** with skill points and leaderboard changes.
- **Custom loading screens** for API requests.
- **Session timeout pop-ups** for smooth authentication handling.
- **Error handling with toasts** for user-friendly feedback.

---

## 🏗️ Tech Stack

### **Backend Technologies**:
- **🟢 Node.js** - Server-side JavaScript runtime  
- **🚀 Express.js** - Fast and lightweight web framework for Node.js  
- **🐬 MySQL** - Relational database for structured data  
- **🔑 JWT Authentication** - Secure token-based authentication  
- **🔐 Bcrypt** - Password hashing for security  
- **🛠️ REST API** - Backend follows RESTful principles  

### **Frontend Technologies**:
- **🌐 HTML** - Structure of web pages  
- **🎨 CSS** - Styling and layout  
- **⚡ JavaScript** - Adds interactivity and logic  
- **🖌️ Bootstrap** - Responsive UI framework  
- **🔄 Fetch API & Axios** - Data fetching from backend using `fetchMethod` and `axiosMethod` from `queryCmds.js` learnt in Practical 7 

### **Other Important Tools**:
- **🐙 GitHub** - Version control and collaboration  
- **📦 npm** - Dependency management for Node.js  
- **📌 VS Code** - Preferred IDE for development  
- **🔄 Postman** - API testing and debugging  


---

## 🛠️ Code Structure & Organization

### **Folder Structure**
```
Galactic Explorers (bed-ca2-BalamuruganSiddhartha)

├───public
│   ├───assets
│   │   ├───fonts
│   │   ├───img
│   │
│   ├───components
│   │   ├───footer.js
│   │   ├───loadingScreen.js
│   │   ├───navBar.js
│   │
│   ├───css
│   │   ├───explore.css
│   │   ├───fitness.css
│   │   ├───guildChat.css
│   │   ├───guilds.css
│   │   ├───home.css
│   │   ├───login.css
│   │   ├───marketplace.css
│   │   ├───navbar.css
│   │   ├───profile.css
│   │   ├───register.css
│   │   ├───review.css
│   │   ├───toast.css
│   │
│   ├───js
│   │   ├───createToast.js
│   │   ├───getCurrentURL.js
│   │   ├───getUserDetails.js
│   │   ├───handleChallengeCompletion.js
│   │   ├───handleChallengeCreation.js
│   │   ├───handleChallengeDeletion.js
│   │   ├───handleChallengeEdit.js
│   │   ├───handleDeleteAccount.js
│   │   ├───handleGuildActions.js
│   │   ├───handleGuildCreation.js
│   │   ├───handleGuildMessages.js
│   │   ├───handleItemPurchase.js
│   │   ├───handleItemSale.js
│   │   ├───handlePlanetExploration.js
│   │   ├───handleProfileEdit.js
│   │   ├───handleReviewDeletion.js
│   │   ├───handleReviewEdit.js
│   │   ├───handleReviewSubmission.js
│   │   ├───loadChallengesAndParticipants.js
│   │   ├───loadExplorationChart.js
│   │   ├───loadFitnessChallenges.js
│   │   ├───loadGuildMessages.js
│   │   ├───loadGuilds.js
│   │   ├───loadGuildsLeaderboard.js
│   │   ├───loadInventory.js
│   │   ├───loadItems.js
│   │   ├───loadItemsByType.js
│   │   ├───loadLeaderboard.js
│   │   ├───loadPlanets.js
│   │   ├───loadPlanetsExplored.js
│   │   ├───loadReviews.js
│   │   ├───loginUser.js
│   │   ├───passwordStrength.js
│   │   ├───passwordToggle.js
│   │   ├───queryCmds.js
│   │   ├───registerUser.js
│   │   ├───refreshToken.js
│   │   ├───reviews.js
│   │   ├───userNavbarToggle.js
│   │
│   ├───explore.html
│   ├───fitness.html
│   ├───guildChat.html
│   ├───guilds.html
│   ├───home.html
│   ├───login.html
│   ├───marketplace.html
│   ├───profile.html
│   ├───register.html
│   ├───review.html
│
├───src
│   ├───configs
│   ├───initTables.js
│
├───controllers
│   ├───challengesController.js
│   ├───exploreController.js
│   ├───guildsController.js
│   ├───inventoryController.js
│   ├───marketplaceController.js
│   ├───reviewsController.js
│   ├───tokenController.js
│   ├───usersController.js
│
├───middlewares
│   ├───bcryptMiddleware.js
│   ├───jwtMiddleware.js
│
├───models
│   ├───challengesModel.js
│   ├───exploreModel.js
│   ├───guildsModel.js
│   ├───inventoryModel.js
│   ├───marketplaceModel.js
│   ├───reviewsModel.js
│   ├───usersModel.js
│
├───routes
│   ├───challengesRoutes.js
│   ├───exploreRoutes.js
│   ├───guildsRoutes.js
│   ├───inventoryRoutes.js
│   ├───mainRoutes.js
│   ├───marketplaceRoutes.js
│   ├───reviewRoutes.js
│   ├───usersRoutes.js
├───services
│   ├───db.js
|
|  ├───app.js
|
├───.env
├───index.js
├───package-lock.json
├───package.json
├───README.md
```

---

## 📜 JavaScript Files (Frontend-Backend Links) & Their Purpose

Below is a brief description of each JavaScript file I've used for my CA2 to link my API to the frontend in the project:

### **Utility Functions**
- `createToast.js` – Handles notification toasts for success and error messages.
- `getCurrentURL.js` – Retrieves the current page URL dynamically.
- `getUserDetails.js` – Fetches user details from the backend API
- `getUserIdFromToken.js` – Extracts the user ID from the JWT token.

### **Challenge Handling**
- `handleChallengeCompletion.js` – Marks a fitness challenge as completed or attempted and awards skill points. 
- `handleChallengeCreation.js` – Manages the creation of new fitness challenges.
- `handleChallengeDeletion.js` – Handles deleting a fitness challenge.
- `handleChallengeEdit.js` – Edits existing fitness challenges.

### **Guild System**
- `handleGuildActions.js` – Handles user actions related to guilds (join, leave, etc.).
- `handleGuildCreation.js` – Manages the creation of new guilds.
- `handleGuildMessages.js` – Handles real-time messaging within a guild! (Galactic Guild Chat)

### **User & Profile Management**
- `handleDeleteAccount.js` – Manages user account deletion requests.
- `handleProfileEdit.js` – Allows users to update their profile details.

### **Item & Marketplace Handling**
- `handleItemPurchase.js` – Handles purchasing items from the marketplace.
- `handleItemSale.js` – Manages selling items back to the marketplace.

### **Exploration System**
- `handlePlanetExploration.js` – Allows users to explore planets and updates their records.

### **Review & Rating System**
- `handleReviewDeletion.js` – Manages deleting user-submitted reviews.
- `handleReviewEdit.js` – Handles editing existing reviews.
- `handleReviewSubmission.js` – Submits new challenge reviews.

### **Leaderboard & Ranking**
- `loadGuildsLeaderboard.js` – Fetches and displays the guild leaderboard.
- `loadLeaderboard.js` – Fetches and displays the user leaderboard.

### **Dynamic Data Loaders From API**
- `loadChallengesAndParticipants.js` – Loads fitness challenges and participants.
- `loadExplorationChart.js` – Loads the chart data for exploration statistics. (`Chart.js`)
- `loadFitnessChallenges.js` – Fetches the list of available fitness challenges.
- `loadGuildMessages.js` – Loads messages in the guild chat.
- `loadGuilds.js` – Retrieves all available guilds.
- `loadInventory.js` – Fetches user inventory items.
- `loadItems.js` – Loads items available in the Galactic Marketplace.
- `loadItemsByType.js` – Fetches marketplace items filtered by type.
- `loadPlanets.js` – Retrieves available planets for exploration.
- `loadPlanetsExplored.js` – Fetches user-explored planets.
- `loadReviews.js` – Loads reviews for different challenges.
- `queryCmds.js` – Contains different methods such as (`axiosMethod`, `fetchMethod` & `jqueryMethod` that fetches backend API to frontend).
- `reviews.js` – Handles review-related functionalities.
- `userNavbarToggle.js` – Manages navbar toggling based on authentication state!

### **Authentication & Security**
- `loginUser.js` – Handles user login authentication.
- `registerUser.js` – Manages user registration.
- `refreshToken.js` – Handles JWT token refresh functionality by checking if a new access token is needed and implements the `POST /api/refresh` endpoint to issue a refreshed token!
- `passwordStrength.js` – Checks password strength during registration.
- `passwordToggle.js` – Enables show/hide password functionality.

---
### **Backend (Node.js & Express)**
- Organised using **modular routes, controllers, and middleware**.
- Database queries are structured using **parameterised SQL** to prevent SQL injection.
- Error handling is implemented using **try-catch blocks and status codes**.
- Routes follow **RESTful API principles** learnt in class!

### **Frontend (JavaScript & Bootstrap)**
- Reusable functions are defined in **separate JS files** for **code reusability and modularity**.
- **Event listeners** manage user interactions dynamically.
- **Custom toasts, modals, and UI components** improve user experience.
- **Optimised API calls** ensure efficient data retrieval.

---

## ⚠️ Error Handling & Feedback Mechanisms
- **Toasts** for error and success messages.
- **Modals** for confirmation before critical actions (e.g., deleting challenges, selling items).
- **Session expiry warnings** with refresh options.
- **d-none class toggling** to prevent UI glitches.

---

## 📂 Database Schema
Tables include:
- `User` (User authentication & profile)
- `FitnessChallenge` (Challenges & skill points)
- `UserCompletion` (Challenge completion records)
- `Marketplace` & `Inventory` (Item transactions & tracking)
- `Planets` & `ExplorationLog` (Exploration system)
- `Guilds` & `GuildMembers` (Guild management)
- `Reviews` (Challenge ratings & feedback)
- `GuildMessages` (Real-time guild chat)

---

## 🔐 User Authentication & Security

### **🔑 JSON Web Token (JWT) Authentication**
I used **JWT (JSON Web Token)** for secure authentication and authorization in the application.  
I also implemented **refresh tokens** to allow users to stay logged in without needing to reauthenticate frequently.  

### **🔐 Bcrypt for Password Hashing**
I used **Bcrypt** to securely hash and store user passwords before saving them in the database.

---

## 📜 API Endpoints!

### **Users API**
- `POST /register` – Register a new user.
- `POST /login` – Authenticate user login.
- `POST /refresh` – Refresh access and refresh tokens.
- `GET /users` – Get a list of all users.
- `PUT /users/:user_id` – Update user details by user ID.
- `GET /users/leaderboard` – Get the leaderboard based on skill points.
- `GET /users/:user_id` – Get user details with guild information.

### **Fitness Challenge API**
- `POST /challenges` – Create a new challenge.
- `GET /challenges` – Get all challenges.
- `PUT /challenges/:challenge_id` – Update YOUR challenge by challenge ID.
- `DELETE /challenges/:challenge_id` – Delete YOUR challenge by challenge ID.
- `POST /challenges/:challenge_id` – Create a new challenge completion record.
- `GET /challenges/:challenge_id` – Get all users who completed a challenge.

### **Inventory API**
- `GET /inventory/:user_id` – Allows user to see their inventory after purchasing from the marketplace by user_id.  
  **Easter Egg**: Adds **Essential Survival Pack** (when first accessed)!
- `GET /inventory/:user_id/:item_type` – Allows easy view for users to filter their inventory by item type.

### **Marketplace API**
- `GET /marketplace` – Get all items for sale.
- `GET /marketplace/:item_type` – Get items by type.
- `POST /marketplace/buy` – Buy an item from the marketplace.
- `POST /marketplace/sell` – Sell an item back to the marketplace.

### **Exploration API**
- `GET /explore` – Get all available planets for exploration.
- `POST /explore/:planet_id` – Explore a planet and earn skill points.
- `GET /explore/:user_id` – Get the list of planets explored by a user.

### **Guild API**
- `POST /guilds` – Create a new guild.
- `GET /guilds` – Get a list of all guilds.
- `POST /guilds/join` – Join an existing guild.
- `POST /guilds/leave` – Leave a guild.
- `GET /guilds/:guild_id` – Get members of a guild.
- `DELETE /guilds` – Delete a guild (**Creator only**).

### **Guild Chat API**
- `POST /guilds/:guild_id/messages` – Send a message in a guild chat.
- `GET /guilds/:guild_id/messages` – Fetch messages in a guild chat.
- `DELETE /guilds/:guild_id/messages/:message_id` – Delete YOUR guild message.
- `PUT /guilds/:guild_id/messages/:message_id` – Edit YOUR guild message.

### **Reviews API**
- `GET /reviews` – Fetch all reviews.
- `GET /reviews/challenge/:challenge_id` – Fetch reviews for a challenge.
- `POST /reviews` – Submit a review.
- `GET /reviews/:id` – Retrieve a review by ID.
- `PUT /reviews/:id` – Edit YOUR review.
- `DELETE /reviews/:id` – Delete YOUR review.


---

## 📌 Conclusion
Galactic Explorers is a **fully functional, engaging Gamified Fitness Tracker** designed to motivate users to stay active through fun fitness challenges. By integrating **challenges, leaderboards, planet exploration, Galactic Guilds and an interactive Galactic Marketplace**, this project successfully combines **health and technology in an exciting and immersive way**.

---

✅ **Project Completed for Back-End Web Development CA2**  
💡 Developed by: **Balamurugan Siddhartha** *(P2404312)*
📌 **Singapore Polytechnic | Diploma in Applied AI & Analytics** *(DAAA/FT/1B/07)*
