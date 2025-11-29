# Brainstorming Session Results

**Session Date:** 2025-11-24
**Facilitator:** Business Analyst Mary
**Participant:** BIP

## Session Start

**Approach Selected:** User-directed technique pivot.
**Technique for this session:** Mind Mapping

## Executive Summary

**Topic:** User Journey Features

**Session Goals:** To identify and explore new features related to the user journey.

**Techniques Used:** Mind Mapping

**Total Ideas Generated:** N/A (Session focused on detailing existing flows)

### Key Themes Identified:

{{key_themes}}

## Technique Sessions

### Flow 1: Pre-Game Setup (Mind Map Details)

*   **Main Screen**
    *   Primary Focus:
        *   Button: "Create Game"
        *   Button: "Join Game"
    *   Secondary Element:
        *   Fold-down menu: "How to Play"
            *   Content: Instructions for the game.
*   **"Create Game" Flow (Host)**
    *   **1. Difficulty Selection Screen**
        *   Input Type: Dropdown Menu
        *   Options: "Easy (12 characters)", "Medium (24 characters)", "Hard (48 characters)"
        *   Label/Title: "Select Difficulty"
    *   **2. Waiting Lobby / Board Setup (Host View)**
        *   **Layout:**
            *   **Main Area:** The "Player Board" grid for the current game.
            *   **Side/Bottom Panel (Scrollable):** The "Character Pool" containing all available characters to choose from.
        *   **Host Controls:**
            *   **"Fill in Board" Button:**
                *   Action: Randomly populates the empty slots on the Player Board from the Character Pool.
            *   **"Upload Your Own" Button:**
                *   Action: Initiates the custom character upload process.
                *   **Upload UI:**
                    *   Input: "Name your character" text box.
                    *   Input: File selector for image upload.
                    *   Action: "Save Character" button (adds to Character Pool).
        *   **Lobby Info & Actions:**
            *   Primary Information: Unique Game Code + "Copy Code" button.
            *   Status Indicator: "Waiting for player to join..."
            *   Lobby Action: "Start Game" button
                *   **Condition:** Disabled until a second player joins AND the Player Board is completely filled with characters.
*   **"Join Game" Flow (Joining Player)**
    *   **1. Enter Code Screen**
        *   Input Type: Text box
        *   Label/Prompt: "Enter Game Code"
        *   Action: "Join" button
        *   **Error Handling:**
            *   If code is invalid -> "Invalid Code" error message.
            *   If room is full -> "Game Room is Full" error message.
    *   **2. Waiting Lobby (Joining Player View)**
        *   Status Indicator: "Waiting for Host to start the game..."
        *   Visual: Can see the character board being assembled/changed by the host in real-time.
        *   No actions available for the joining player at this stage.
*   **Game Start Action**
    *   Host clicks "Start Game".
    *   Both players are transitioned to the main game interface.
    *   The first official move for both players is to secretly select their character.

### Flow 2: Core Gameplay Loop (Mind Map Details)

*   **1. Secret Character Selection Phase**
    *   **Player Action:** Click on a character portrait directly on the main game board.
    *   **UI Feedback (For the selecting player only):**
        *   The chosen character's portrait appears in a dedicated display area (e.g., "Your Character" box to the side of the board).
    *   **State Change:** A "Ready" button becomes active/clickable.
    *   **Opponent's View:** Sees a "Waiting for opponent..." status.
*   **2. Game Start Trigger**
    *   **Player Action:** Click the activated "Ready" button.
    *   **Condition:** The game officially begins (turn-based play starts) only after *both* players have selected a character and clicked "Ready".
    *   **Turn Order Rule:** The *Joining Player* is always Player 1 for the first turn.
*   **3. Turn-Based Gameplay Loop**
    *   **A. Turn Start**
        *   **Active Player UI:** A pop-up message appears saying "Your Turn".
        *   **Waiting Player UI:** Screen might be slightly dimmed or show a "Waiting for Opponent" message.
    *   **B. Asking a Question (Active Player's Action)**
        *   **Communication Interface:** A chat-style window.
        *   **Input Methods:**
            *   1. Type a custom yes/no question directly into the chat.
            *   2. Select a question from a list of pre-made, common questions.
            *   3. Use "AI Hint" button to suggest a question.
    *   **C. Answering a Question (Waiting Player's Action)**
        *   **Response Interface:** Simple "Yes" and "No" buttons appear in response to the question.
    *   **D. Eliminating Characters (Active Player's Action)**
        *   **Mechanic:** Click on a character portrait on the main board to toggle its state.
        *   **Visual Feedback:** The character's portrait is grayed out. Clicking again restores it.
    *   **E. Turn Actions (Active Player)**
        *   **Primary Action:** Ask a question.
        *   **Alternative Action:** Click the "Make a Guess" button (initiates Flow 3).
    *   **F. Ending the Turn**
        *   Player clicks the **"End Turn"** button to pass control to the opponent.

### Flow 3: Winning the Game (Mind Map Details)

*   **1. Initiating a Guess**
    *   During their turn, a player clicks the "Make a Guess" button.
    *   The UI changes to a "Final Guess" mode.
    *   Player clicks on the single character they believe is their opponent's secret character.
*   **2. Guess Outcome**
    *   **If Correct:** The guessing player wins.
    *   **If Incorrect:** The guessing player loses; their opponent wins.
*   **3. Game Over Screen**
    *   **UI:** A pop-up window appears for both players.
    *   **Content:** Displays the winner and the reason (e.g., "Player 1 Wins! They guessed 'Steve' correctly.").
    *   **Actions:**
        *   Button: "End Game" -> Takes both players to the main menu/home screen.
        *   Button: "Rematch" -> Initiates the Rematch Flow.
*   **4. Rematch Flow**
    *   The lobby/board setup is skipped.
    *   Both players are returned to the main game interface with the same character board.
    *   The game state is reset, and players proceed to the "Secret Character Selection Phase".


## Idea Categorization

### Immediate Opportunities

_Ideas ready to implement now_

{{immediate_opportunities}}

### Future Innovations

_Ideas requiring development/research_

{{future_innovations}}

### Moonshots

_Ambitious, transformative concepts_

{{moonshots}}

### Insights and Learnings

_Key realizations from the session_

{{insights_learnings}}

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: {{priority_1_name}}

- Rationale: {{priority_1_rationale}}
- Next steps: {{priority_1_steps}}
- Resources needed: {{priority_1_resources}}
- Timeline: {{priority_1_timeline}}

#### #2 Priority: {{priority_2_name}}

- Rationale: {{priority_2_rationale}}
- Next steps: {{priority_2_steps}}
- Resources needed: {{priority_2_resources}}
- Timeline: {{priority_2_timeline}}

#### #3 Priority: {{priority_3_name}}

- Rationale: {{priority_3_rationale}}
- Next steps: {{priority_3_steps}}
- Resources needed: {{priority_3_resources}}
- Timeline: {{priority_3_timeline}}

## Reflection and Follow-up

### What Worked Well

{{what_worked}}

### Areas for Further Exploration

{{areas_exploration}}

### Recommended Follow-up Techniques

{{recommended_techniques}}

### Questions That Emerged

{{questions_emerged}}

### Next Session Planning

- **Suggested topics:** {{followup_topics}}
- **Recommended timeframe:** {{timeframe}}
- **Preparation needed:** {{preparation}}

---

_Session facilitated using the BMAD CIS brainstorming framework_
