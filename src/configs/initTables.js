const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
    if (error) {
      console.error("Error creating tables:", error);
    } else {
      console.log("Tables created successfully");
    }
    process.exit();
};

bcrypt.hash("Singa12#", saltRounds, (error, hash) => {
    if (error) {
      console.error("Error hashing password:", error);
    } else {
      console.log("Hashed password:", hash);
  
      const SQLSTATEMENT = `
        DROP TABLE IF EXISTS GuildMessages;
        DROP TABLE IF EXISTS Reviews;
        DROP TABLE IF EXISTS GuildMembers;
        DROP TABLE IF EXISTS ExplorationLog;
        DROP TABLE IF EXISTS Inventory;
        DROP TABLE IF EXISTS UserCompletion;
        DROP TABLE IF EXISTS FitnessChallenge;
        DROP TABLE IF EXISTS Planets;
        DROP TABLE IF EXISTS Marketplace;
        DROP TABLE IF EXISTS Guilds;
        DROP TABLE IF EXISTS User;
  
        CREATE TABLE User (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT NOT NULL,          
            password TEXT NOT NULL,       
            skillpoints INT DEFAULT 0     
        );
  
        CREATE TABLE FitnessChallenge (
            challenge_id INT AUTO_INCREMENT PRIMARY KEY,
            creator_id INT NOT NULL,
            challenge TEXT NOT NULL,
            skillpoints INT NOT NULL
        );
  
        CREATE TABLE UserCompletion (
            complete_id INT AUTO_INCREMENT PRIMARY KEY,
            challenge_id INT NOT NULL,
            user_id INT NOT NULL,
            completed BOOL NOT NULL,
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        );
  
        CREATE TABLE Marketplace (
            item_id INT AUTO_INCREMENT PRIMARY KEY,
            item_name TEXT NOT NULL,
            item_description TEXT,
            item_type TEXT NOT NULL,
            cost INT NOT NULL
        );
        
        CREATE TABLE Inventory (
            inventory_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            item_id INT NOT NULL,
            item_name TEXT NOT NULL,              
            item_description TEXT,                
            item_type TEXT NOT NULL,              
            acquisition_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
        );

        CREATE TABLE Planets (
            planet_id INT AUTO_INCREMENT PRIMARY KEY,
            planet_name TEXT NOT NULL,
            planet_description TEXT,
            reward_skillpoints INT,
            required_items TEXT           
        );
  
        CREATE TABLE ExplorationLog (
            exploration_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,       
            planet_id INT NOT NULL,     
            exploration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE Guilds (
            guild_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,             
            guild_name TEXT NOT NULL,
            guild_description TEXT,
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE GuildMembers (
            member_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,             
            guild_id INT NOT NULL,            
            join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE Reviews (
            id INT PRIMARY KEY AUTO_INCREMENT, 
            review_amt INT NOT NULL,           
            user_id INT NOT NULL,              
            challenge_id INT NOT NULL,         
            review_text TEXT,                  
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
            UNIQUE(user_id, challenge_id)      
        );
        
        CREATE TABLE GuildMessages (
            message_id INT AUTO_INCREMENT PRIMARY KEY,
            guild_id INT NOT NULL,
            user_id INT NOT NULL,
            username TEXT NOT NULL,
            message_text TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (guild_id) REFERENCES Guilds(guild_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
        );

        INSERT INTO User (username, email, password) VALUES
        ('Chitanyaa', 'chitanyaa@example.com', '${hash}'),
        ('ShadowRogue', 'shadow.rogue@example.com', '${hash}'),
        ('BlazeHunter', 'blaze.hunter@example.com', '${hash}'),
        ('cashmoneysid', 'sidventures@example.com', '${hash}'),
        ('CelestialNomad', 'celestial.nomad@example.com', '${hash}'),
        ('NebulaSeeker', 'nebula.seeker@example.com', '${hash}'),
        ('ExplorerKing', 'explorer.king@example.com', '${hash}'),
        ('FitTitan', 'fit.titan@example.com', '${hash}'),
        ('QuantumVoyager', 'quantum.voyager@example.com', '${hash}'),
        ('GalacticKnight', 'galactic.knight@example.com', '${hash}');


        INSERT INTO FitnessChallenge (challenge_id, creator_id, challenge, skillpoints) VALUES
        (1, 1, 'Complete 2.4km within 15 minutes 🏃‍♂️⏱️', 50),
        (2, 1, 'Cycle around the island for at least 50km 🚴‍♂️🌍', 100),
        (3, 2, 'Complete a full marathon (42.2km) 🏅🏃‍♂️', 150),
        (4, 2, 'Hold a plank for 5 minutes 🏋️‍♂️💪', 50),
        (5, 2, 'Perform 100 push-ups in one session 💥💪', 75),
        (6, 3, 'Swim 5km non-stop in open water 🏊‍♂️🌊', 120),
        (7, 4, 'Perform 200 squats without rest 🏋️‍♂️🔥', 80),
        (8, 5, 'Run 10km uphill on a treadmill ⛰️🏃‍♂️', 100),
        (9, 6, 'Hold a wall sit for 10 minutes 🪑🔥', 90);

        
        INSERT INTO Marketplace (item_name, item_description, item_type, cost) VALUES
        -- Space Exploration Gear
        ('Nano-Heal Kit', 'Repairs 50% of total health using nanobots', 'Gear', 150),
        ('Oxygen Refill Canister', 'Replenishes oxygen levels in zero-gravity environments', 'Gear', 100),
        ('Jetpack Module', 'Allows short bursts of flight in low-gravity zones', 'Gear', 250),

        -- Advanced Tools
        ('Plasma Drill', 'Drills through asteroid cores to extract rare minerals', 'Tool', 400),
        ('Star Compass', 'A navigation device for tracking nearby planets', 'Tool', 300),
        ('Hologram Projector', 'Creates a decoy hologram to distract enemies', 'Tool', 350),

        -- Protective Suits
        ('Explorer Suit', 'Standard suit with moderate protection and oxygen supply', 'Armor', 200),
        ('Radiation Shield Suit', 'Protects against radiation in hostile environments', 'Armor', 450),
        ('Voidwalker Suit', 'Advanced suit for extreme zero-gravity survival', 'Armor', 500),

        -- Rare Cosmic Artifacts
        ('Starlight Crystal', 'A rare crystal that emits unlimited light', 'Artifact', 450),
        ('Void Sphere', 'A mysterious orb with unknown gravitational properties', 'Artifact', 500),
        ('Chrono Shard', 'Enables brief manipulation of time', 'Artifact', 500);

        INSERT INTO Planets (planet_name, planet_description, reward_skillpoints, required_items) VALUES
        ('Nebula-5', 'A mysterious nebula filled with cosmic debris and unknown resources.', 25, '1'),
        ('Asteroid Belt', 'A dense field of asteroids rich with minerals and rare resources.', 25, '2'),
        ('Mars-X', 'A barren planet with hidden caves and ancient alien technology.', 60, '3,4'),
        ('Titan', 'A moon of Saturn known for its icy surface and underground oceans.', 30, '5'),
        ('Zeta-3', 'A volatile planet surrounded by intense radiation but rich in valuable minerals.', 50, '6'),
        ('Nova Prime', 'A star system in the process of dying, with dangerous, unstable star activity.', 60, '7,8'),
        ('Venus-7', 'A planet with extreme weather conditions and dangerous storms.', 40, '9'),
        ('Andromeda-5', 'A distant planet in the Andromeda galaxy with unique flora and fauna.', 50, '10'),
        ('Blackhole-12', 'A planet near a black hole where gravity and time behave unpredictably.', 60, '11,12');

        INSERT INTO Guilds (user_id, guild_name, guild_description) VALUES
        (1, 'SOC Backenders', 'A youth of SP SoC students, on a fitness journey together! 🏃‍♂️💪'),
        (2, 'SP Astro Pioneers', 'Exploring the unknown, one fitness challenge at a time! 🚀🌟'),
        (3, 'PolyTech Navigators', 'Innovators and adventurers from SP, conquering new fitness hurdles! 🏋️‍♂️🌍'),
        (4, 'SP Interstellar Nomads', 'Travelling beyond boundaries, fueled by fitness. 🌌💫'),
        (5, 'Cosmos Innovators', 'SP minds pushing the limits of fitness and discovery. 🚴‍♂️🔬'),
        (6, 'Singularity Scholars', 'SP’s brightest, unravelling the mysteries of space and fitness. 🧠✨');

        INSERT INTO UserCompletion (challenge_id, user_id, completed, notes) VALUES
        (1, 1, TRUE, 'Completed within 14 minutes 🏃‍♂️🔥'),
        (1, 1, TRUE, 'Second attempt: Improved to 13:30 mins ⏱️'),
        (2, 2, TRUE, 'Completed in 3 hours 🚴‍♂️'),
        (2, 2, FALSE, 'Had to stop at 35km due to cramps 😓'),
        (3, 3, TRUE, 'Completed in 6 hours 🏅'),
        (3, 3, FALSE, 'Gave up after 30km 🏃‍♂️💀'),
        (4, 4, FALSE, 'Failed at 4 minutes mark 🏋️‍♂️💀'),
        (4, 4, TRUE, 'Finally held for 5 minutes on second try! 🎉'),
        (5, 5, TRUE, 'Completed in 20 minutes 💪'),
        (5, 5, FALSE, 'Attempted but stopped at 80 push-ups 😤'),
        (6, 6, TRUE, 'Swam 5km in 1hr 45min 🏊‍♂️🔥'),
        (6, 6, FALSE, 'Only managed 3km before getting tired 😓'),
        (7, 7, TRUE, '200 squats done, legs are dead 😵‍💫'),
        (7, 7, FALSE, 'Had to stop at 150 squats 🏋️‍♂️'),
        (8, 8, TRUE, '10km uphill complete, almost passed out 🏃‍♂️💨'),
        (8, 8, FALSE, 'Couldn’t finish, gave up at 8km ⛰️'),
        (9, 9, TRUE, 'Held wall sit for full 10 minutes! 🏆'),
        (9, 9, FALSE, 'Collapsed at 7 min mark, still trying! 😓'),
        (1, 10, TRUE, 'Completed the 2.4km in 12:45, new record! 🎉🔥'),
        (1, 10, TRUE, 'Ran again, slowed down to 13:15 this time 🏃‍♂️'),
        (5, 10, TRUE, '100 push-ups completed in 10 minutes 💪🔥'),
        (5, 10, FALSE, 'Got to 90 and arms gave out 💀');


        INSERT INTO Reviews (review_amt, user_id, challenge_id, review_text) VALUES
        (5, 1, 1, 'Great challenge, highly recommend!'),
        (4, 2, 2, 'Tough but rewarding!'),
        (3, 3, 3, 'Too hard, but I managed.'),
        (5, 4, 4, 'Love this challenge, very fun.');
        
        INSERT INTO GuildMessages (guild_id, user_id, username, message_text) VALUES
        (1, 1, 'Chitanyaa', 'Welcome to SOC Backenders! 🚀'),
        (1, 2, 'ShadowRogue', 'Excited to be part of this guild. Let’s get stronger together! 💪'),
        (1, 3, 'BlazeHunter', 'Anyone up for a fitness challenge today? 🏋️‍♂️'),
    
        (2, 4, 'cashmoneysid', 'Void Wanderers are the best! 🌌'),
        (2, 5, 'CelestialNomad', 'Exploring deep space is thrilling. Let’s conquer the stars! ⭐'),
        (2, 6, 'NebulaSeeker', 'Does anyone have tips for completing the 10km run challenge? 🏃‍♂️'),
    
        (3, 7, 'ExplorerKing', 'Looking forward to our next adventure. Where are we heading? 🔭'),
        (3, 8, 'FitTitan', 'We need to train harder if we want to lead the leaderboard! 🚴‍♂️🔥'),
        (3, 9, 'QuantumVoyager', 'Let’s aim for maximum skill points this week! 💯'),
    
    
        (5, 10, 'GalacticKnight', 'Celestial Warriors, we fight together! ⚔️✨'),
        (5, 1, 'Chitanyaa', 'Who’s ready for the next battle challenge? 🏆🔥'),
    
        (6, 2, 'ShadowRogue', 'Singularity Scholars, time to unlock new knowledge and strength! 🧠💪'),
        (6, 3, 'BlazeHunter', 'Let’s work on some next-level strategies for fitness challenges. 🚀');


        INSERT INTO GuildMembers (user_id, guild_id, join_date) VALUES
        (1, 1, CURRENT_TIMESTAMP),
        (2, 1, CURRENT_TIMESTAMP),
        (3, 1, CURRENT_TIMESTAMP),

        (4, 2, CURRENT_TIMESTAMP),
        (5, 2, CURRENT_TIMESTAMP),
        (6, 2, CURRENT_TIMESTAMP),

        (7, 3, CURRENT_TIMESTAMP),
        (8, 3, CURRENT_TIMESTAMP),
        (9, 3, CURRENT_TIMESTAMP),

        (10, 5, CURRENT_TIMESTAMP),
        (1, 5, CURRENT_TIMESTAMP),

        (2, 6, CURRENT_TIMESTAMP),
        (3, 6, CURRENT_TIMESTAMP);

        `;
        pool.query(SQLSTATEMENT, callback);
  }
});