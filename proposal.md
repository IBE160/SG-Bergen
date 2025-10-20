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

## User Stories
1.  As a player, I want to select 12/24/48 characters from a larger pool, so that the game feels varied.
2.  As a player, I want to click on character images to eliminate them during the game, so that I can keep better track.
3.  As a user, I want to upload my own images to create personal character sets, so that the game becomes more fun and relevant.
4.  As a player, I want to chat with my opponent during the game, so that it feels more social.
5.  As a player, I want to receive AI-generated questions as a "hint" option, so that I get help and inspiration during the game.


## Technical Architecture & Plan

### Technical Stack
-   Platform: Responsive Web Application built to be accessible on PC, tablet, and mobile browsers.
-   Frontend: Next.js (React Framework) with Tailwind CSS for styling.
-   Backend & Database: Supabase will be used to provide the PostgreSQL database, user authentication, and real-time game state synchronization.
-   AI Integration: AI-generated questions will be powered by a cost-effective, open-source LLM like DeepSeek, accessed via a third-party inference API (e.g., Groq, Together AI).

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


