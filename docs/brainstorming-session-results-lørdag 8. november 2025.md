# User Flow Specification: Digital "Guess Who" Game

**Session Date:** lørdag 8. november 2025
**Facilitator:** Mary (Business Analyst)
**Participant:** BIP
**Version:** 1.0

## 1. Introduction

This document details the user flows for the "Digital Guess Who" game, as defined in our brainstorming session. It is intended to serve as a clear guide for the development agents.

The core design principles identified are:
*   **Clarity and Confirmation:** The user interface should be intuitive and provide confirmation steps for critical actions to prevent errors.
*   **Focused Core Gameplay:** The MVP will focus on the fundamental 1-on-1 "Guess Who" experience.
*   **Robustness for Real-time:** The game must handle disconnections gracefully.

---

## 2. Flow 1: Starting and Joining a Game

This flow describes how two players start a new game session.

### 2.1. Initial Game Selection
1.  The user opens the application.
2.  The main menu displays two primary options: **'Create Game'** and **'Join Game'**.

### 2.2. Host Player Flow
1.  The Host Player clicks **'Create Game'**.
2.  The Host is taken to a **'Game Setup Menu'**.
3.  In this menu, the Host selects:
    *   **Difficulty Level** (e.g., Easy, Medium, Hard).
    *   **Character Set** (from the available pool).
4.  After making selections, the Host confirms, and the system generates a unique **Game Code**.
5.  The Host is taken to a **'Waiting for Opponent'** screen, which displays the Game Code clearly.
6.  The Host shares the Game Code with a friend.

### 2.3. Joining Player Flow
1.  The Joining Player clicks **'Join Game'** from the main menu.
2.  The Joining Player is prompted to **enter the Game Code**.
3.  After entering the code, the system validates it.
4.  Upon successful validation, the Joining Player is taken to the game room.

### 2.4. Game Start
1.  When the Joining Player enters the game room, the Host's 'Waiting for Opponent' screen updates to show the opponent has joined.
2.  Both players now see a **'Ready'** button.
3.  The game begins only after **both** players have clicked their 'Ready' button.

---

## 3. Flow 2: Core Gameplay Loop

This flow describes the turn-by-turn mechanics of the game.

### 3.1. Character Selection
1.  At the start of the game, both players are prompted to **'Choose your secret character'**.
2.  The full grid of characters for the selected difficulty is displayed.
3.  Each player clicks on a character's portrait to select them.
4.  A confirmation prompt appears: **'Are you sure you want this character?'**.
5.  The player confirms their choice.
6.  The selection is locked, and the player waits for the opponent to confirm their choice.

### 3.2. Player's Turn
1.  A dedicated **'Question Box'** UI element becomes active for the current player.
2.  The player types their yes/no question into a **text input field**.
3.  An optional **'AI Hint' button** is available within the box. If clicked, the AI suggests a strategic question.
4.  The player clicks an **'Ask'** or **'Submit'** button to send the question.

### 3.3. Opponent's Turn (Answering)
1.  The opponent's screen displays the question asked by the current player.
2.  Two buttons, **'Yes'** and **'No'**, are presented.
3.  The opponent clicks their answer.

### 3.4. Elimination
1.  After the opponent answers, the current player is prompted to eliminate characters.
2.  The player clicks on the portraits of characters that do **not** match the answer.
3.  The clicked portraits visually **'flip down'** or become grayed out.

### 3.5. Turn End
1.  After elimination, the turn automatically passes to the other player.
2.  The gameplay loop (Player's Turn, Answering, Elimination) repeats.

---

## 4. Flow 3: Winning the Game

This flow describes how the game ends.

### 4.1. Making a Guess
1.  During their turn, a player can choose to **'Make a Guess'** instead of asking a question. This option is located in the 'Question Box'.
2.  When clicked, a confirmation prompt appears: **'Are you sure you want to make a guess? This is a final decision.'**
3.  The player confirms their intention.

### 4.2. Guessing
1.  The UI prompts the player to **'Select the character you want to guess'**.
2.  The player clicks on one of the remaining 'face-up' character portraits.
3.  A final confirmation prompt appears: **'Is [Character Name] your final guess?'**.
4.  The player confirms their guess.

### 4.3. Outcome
1.  The system checks if the guess is correct.
2.  **If Correct:**
    *   The guessing player sees a **'You Win!'** screen.
    *   The opponent sees a **'You Lose!'** screen.
3.  **If Incorrect:**
    *   The guessing player sees a **'You Lose!'** screen.
    *   The opponent sees a **'You Win!'** screen.

### 4.4. Rematch/Exit
1.  After the outcome is displayed, both players are presented with two options: **'Play Again'** and **'Return to Main Menu'**.

---

## 5. Non-Functional Requirements (Edge Cases)

*   **Disconnections:** As per previous brainstorming sessions, the game must handle player disconnections gracefully with a grace period for reconnection and clear status updates for the remaining player. A 'heartbeat' mechanism should be implemented to detect disconnections.
