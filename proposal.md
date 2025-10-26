## Case Title
Digital "Guess Who" Game

## Background
The classic board game "Guess Who" is popular because it combines simple gameplay with logical thinking. However, traditional board games are limited by physical components, and few digital versions exist that are both user-friendly and engaging. A digital version can introduce additional features, such as uploading custom characters and using artificial intelligence to generate questions.

## Purpose
To develop a digital version of "Guess Who" that allows users to play against each other online, with support for AI-generated questions and the ability to customize the character selection.

## Target Users
-   Children and young people who want a modern, digital alternative to the board game.
-   Adults who have nostalgic memories of the game and want to play it again.
-   Friends and families who want to play together across different locations.

## Core Functionality

### Must Have (MVP)
-   Two players can play against each other online in a game room accessed via a code.
-   A base pool of at least 50 characters is available, from which players choose their set.
-   Interactive function to "flip down" (eliminate) characters as questions are answered.
-   Official "Guess Who" rules are implemented digitally for turn-based play and win conditions.
-   Difficulty settings: Players can choose between Easy (12 characters), Medium (24), and Hard (48).

### Nice to Have (Optional Extensions)
-   Ability for users to upload their own images to create custom character sets.
-   A chat function between players within a game room.
-   An AI-generated question "hint" option to assist players.
-   A full user account system with usernames/passwords to track stats and save custom character sets.

## Data Requirements
-   Characters: name, image_url, attributes (e.g., hair_color, gender, has_glasses, has_beard, eye_color, etc.).
-   Game Rooms: room_code (unique identifier), game_state (JSON object containing player info, active/eliminated characters, current_turn), created_at.
-   Users (Future Extension): user_id, username, email, password_hash.

## User Flows

### Flow 1: Starting and Joining a Game
1.  **Host Player:**
    *   Opens the application and clicks "Create Game."
    *   Selects a difficulty level (e.g., 24 characters).
    *   Receives a unique game code (e.g., "XYZ123").
    *   Is taken to a waiting screen and shares the code with a friend.
2.  **Joining Player:**
    *   Opens the application and clicks "Join Game."
    *   Enters the game code.
    *   Both players land in the game room, ready to start.

### Flow 2: Core Gameplay Loop
1.  **Character Selection:** Both players are prompted to secretly select one character from the board that their opponent will have to guess.
2.  **Player 1's Turn:**
    *   Player 1 formulates a yes/no question.
    *   *Optional:* Player 1 clicks the "AI Hint" button, and the system suggests a question like, "Does your character have a beard?"
    *   Player 1 asks the question.
3.  **Player 2's Turn:**
    *   Player 2 answers "Yes" or "No."
4.  **Elimination:** Player 1 clicks on the portraits of characters that don't match the answer, causing them to be visually "flipped down" or grayed out.
5.  **Turn End:** The turn automatically passes to Player 2, and the process repeats.

### Flow 3: Winning the Game
1.  **Making a Guess:** When a player feels confident, they click the "Make a Guess" button instead of asking a question.
2.  **Guessing:** The player selects the final character they believe their opponent chose.
3.  **Outcome:**
    *   **Correct Guess:** A "You Win!" screen is displayed.
    *   **Incorrect Guess:** A "You Lose!" screen is displayed, and the opponent wins.
4.  **Rematch:** Both players are given the option to "Play Again" or return to the main menu.


## Technical Architecture & Plan

### Technical Stack
-   Platform: Responsive Web Application built to be accessible on PC, tablet, and mobile browsers.
-   Frontend: Next.js (React Framework) with Tailwind CSS for styling.
-   Backend & Database: Supabase will be used to provide the PostgreSQL database, user authentication, and real-time game state synchronization.
-   AI Integration: AI-generated questions will be powered by the google gemini 2.5 pro API.

### Authentication
-   The MVP will use a simple, Kahoot-style room code system for creating and joining games. Full user accounts are a planned extension.

### Development Method
-   The project will be developed using the BMAD - method within the Gemini CLI, leveraging specialized agents for each phase of the lifecycle.

### Development Timeline
- Week 1: Product Definition (PM Agent)
  - Focus: Solidify project scope and user stories.
- Week 2-3: System & UX Design (Architect & UX-Expert Agents)
  - Focus: Design the technical foundation and user interface.
- Weeks 4: Agile Development (Dev Agent)
  - Focus: Iteratively build and test the application's MVP and extension features.
- Week 5: Final Testing & Deployment (QA & Dev Agents)
  - Focus: Ensure quality and launch the project.

## Success Criteria
-   Two players can complete a full game loop (start, play, win/loss) with no critical errors.
-   Game state changes (character eliminations, turns) are synchronized between players with a latency of less than 500ms.
-   The core elimination mechanic (clicking to fade a character) is intuitive and has a visual response time of under 100ms.
-   The application maintains a usable and clean layout on the latest versions of Chrome and Firefox on desktop, and on mobile screen widths down to 360px.
-   The AI Hint feature can successfully generate a relevant, grammatically correct yes/no question based on the current set of available characters.
-   The final deployed application includes at least one fully functional "Nice to Have" extension feature.


