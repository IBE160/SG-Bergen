# ibe160 UX Design Specification

_Created on torsdag 20. november 2025 by BIP_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

To create a fun, engaging, and effortless online 'Guess Who' experience, especially when it comes to starting a game with a friend.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Chosen Design System:** shadcn/ui

**Rationale:** Given the existing strong visual direction from the mockups and the project's use of Tailwind CSS, shadcn/ui is an ideal choice. Its unstyled, customizable components built on Radix UI and integrated with Tailwind will allow us to precisely match the desired look and feel while providing robust and accessible UI foundations.

---

## 2. Core User Experience

### 2.1 Defining Experience

**Defining Experience:** It's the app where you can play the game Guess Who with your friend. This emphasizes the core social interaction and the faithful adaptation of the classic game for remote play.

### 2.2 Core Experience Principles

These principles will guide every design decision to ensure the app consistently delivers on its promise:

*   **Effortless Setup:** Starting and joining a game should be quick, intuitive, and free of friction.
*   **Responsive & Clear Gameplay:** Every interaction, from asking a question to eliminating a character, should feel immediate and provide clear feedback.
*   **Intuitive Guidance:** The game should be easy to learn for new players, with clear visual cues and instructions, without getting in the way of experienced players.
*   **Delightful Interactions:** Small touches and animations should enhance the fun and engagement of the game.

### 2.3 Novel UX Patterns

No truly novel UX patterns were identified that required custom design from scratch. The core gameplay leverages established patterns for turn-based interaction and visual feedback.

---

## 3. Visual Foundation

### 3.1 Color System

The visual foundation is built upon a modern dark theme, drawing inspiration directly from the provided mockups.

**Color Palette:**

*   **Primary Accent (Blue):** `#4299E1` - Used for primary calls to action, interactive elements, and branding.
*   **Secondary Accent (Green):** `#48BB78` - Signifies success, positive feedback, and key affirmative actions (e.g., "You Win!", "Yes" button).
*   **Tertiary Accent (Yellow/Orange):** `#ECC94B` - Highlights critical actions like "Make a Guess".
*   **Destructive/Warning (Red):** `#E53E3E` - Used for negative actions, warnings, or error states (e.g., "No" button).
*   **Background:** `#1A202C` - The dominant dark background color, providing a modern and immersive feel.
*   **Card/Panel Background:** `#2D3748` - Slightly lighter dark gray for distinct UI elements like cards and panels.
*   **Text:** `#FFFFFF` (White) / Light Gray - Provides high contrast against the dark backgrounds for readability.
*   **Neutral/Subtle Elements:** Various shades of gray are used for borders, disabled states, and secondary text.

**Typography:**

A clean, modern sans-serif typeface will be used for all text elements, ensuring readability and maintaining a contemporary aesthetic. Font weights will be utilized to establish clear visual hierarchy.

**Spacing and Layout:**

A consistent spacing system (likely based on an 8px or 4px grid) will be applied throughout the interface to ensure visual harmony, alignment, and responsiveness. Elements are well-organized with appropriate use of whitespace to reduce cognitive load.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

The design direction is established by the provided mockups for the Lobby, Game Setup, Gameplay, and Game Over screens. These mockups present a modern, dark-themed, clean, and engaging visual style that fully captures the desired aesthetic and user experience for the game. No refinements or changes are requested at this stage.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

#### Journey 1: Starting and Joining a Game

**User Goal:** To quickly and effortlessly start a game with a friend.

**Approach:** A simple, code-based lobby system that is intuitive and requires minimal steps.

**Flow Steps:**

1.  **Entry (Lobby Screen):**
    *   **User sees:** A clean interface with two primary options: "Start a New Game" and "Join an Existing Game".
    *   **User does:** Clicks either "Start a New Game" (Host) or "Join an Existing Game" (Guest).

2.  **Host Player Flow (Game Setup):**
    *   **User sees:** A game setup screen where they can choose the difficulty level (Easy, Medium, Hard).
    *   **User does:** Selects the desired difficulty.
    *   **System responds:** Generates a unique game code/invite link and displays it prominently. The host is now in the "Game Lobby" waiting for the other player.

3.  **Guest Player Flow (Joining):**
    *   **User sees:** An input field to enter the game code.
    *   **User does:** Enters the shared game code and clicks "Join".
    *   **System responds:** Validates the code. Upon success, the guest is taken to the "Game Lobby". An error message is shown for invalid codes.

4.  **Game Start (Game Lobby):**
    *   **User sees:** Both players are now in the lobby. Each player has a "Ready" button.
    *   **User does:** Clicks the "I'm Ready" button.
    *   **System responds:** The game begins only after both players have signaled they are ready.

**Success State:** Both players are in the main gameplay screen, and the game has officially started.

#### Journey 2: Core Gameplay Loop

**User Goal:** To effectively narrow down the opponent's secret character through strategic questioning and elimination.

**Approach:** A clear turn-based system with intuitive question input, answer feedback, and visual character elimination.

**Flow Steps:**

1.  **Secret Character Selection:**
    *   **User sees:** A grid of characters.
    *   **User does:** Secretly selects one character from the grid.
    *   **System responds:** Confirms the selection and hides it from the opponent.

2.  **Player's Turn (Asking a Question):**
    *   **User sees:** A "Question Box" UI element with a text input field for a yes/no question. An optional "AI Hint" button is available (post-MVP).
    *   **User does:** Types a yes/no question and clicks "Ask" or "Submit".
    *   **System responds:** Sends the question to the opponent.

3.  **Opponent's Turn (Answering):**
    *   **User sees:** The question asked by the active player, with "Yes" and "No" buttons.
    *   **User does:** Clicks either "Yes" or "No".
    *   **System responds:** Sends the answer back to the active player.

4.  **Elimination:**
    *   **User sees:** Their own character board.
    *   **User does:** Clicks on character portraits that do not match the opponent's answer, causing them to visually "flip down" or gray out.
    *   **System responds:** Updates the visual state of the eliminated characters.

5.  **Turn End:**
    *   **User sees:** An indication that the turn has passed.
    *   **System responds:** Automatically passes the turn to the other player.

**Success State:** The player has successfully eliminated characters and narrowed down the possibilities, bringing them closer to guessing the opponent's character.

#### Journey 3: Winning the Game

**User Goal:** To make a final guess and win the game, or to see the game's conclusion.

**Approach:** A clear, high-stakes action that leads to a definitive win/loss outcome, followed by options for re-engagement.

**Flow Steps:**

1.  **Making a Guess:**
    *   **User sees:** A "Make a Guess" button, available during their turn.
    *   **User does:** Clicks the "Make a Guess" button.
    *   **System responds:** Prompts the user to confirm this high-stakes action.

2.  **Guessing:**
    *   **User sees:** The character board, with remaining characters selectable.
    *   **User does:** Selects the character they believe is their opponent's choice.
    *   **System responds:** Confirms the guess and reveals the outcome.

3.  **Outcome:**
    *   **User sees:** A "You Win!" or "You Lose!" screen, which also reveals the opponent's character.
    *   **System responds:** Displays the appropriate outcome to both players.

4.  **Post-Game Options:**
    *   **User sees:** "Play Again" and "Return to Main Menu" buttons.
    *   **User does:** Clicks one of the options.
    *   **System responds:** Navigates the user to a new game lobby or back to the main menu.

**Success State:** The game is concluded, and the user is presented with clear options to either play again or exit the game loop.

---

## 6. Component Library

### 6.1 Component Strategy

The component library strategy is to leverage the `shadcn/ui` design system for foundational components and create custom, application-specific components for more complex UI elements.

**From Design System (`shadcn/ui`):**

*   **Button:** Used for all interactive actions (e.g., "Create Game", "Join", "Ready", "Ask", "Yes/No").
*   **Input:** Used for entering the game code and typing questions.
*   **Card:** Used as the base for character cards and UI panels.
*   **AlertDialog / Dialog:** Used for confirmation prompts (e.g., "Make a Guess?").
*   **Avatar:** Used for player profile icons in the lobby.

**Custom Components:**

The primary custom component is the **Character Board**, which is a grid composed of interactive **Character Cards**.

#### Custom Component: Character Card

*   **Purpose:** To display a single character and allow the user to toggle their "eliminated" state.
*   **Anatomy:**
    *   A `Card` component containing the character's `Image` and `Name`.
*   **Behavior:**
    *   On click, the card toggles between its "Active" and "Eliminated" states.
*   **States:**
    *   **Active:** The character is a potential candidate. The card is displayed in full color.
    *   **Eliminated:** The character has been ruled out. The character's image is grayed out to maintain visibility, allowing the user to easily see who they have eliminated and potentially undo the action.
*   **Accessibility:**
    *   The card should be focusable and its state (Active/Eliminated) should be announced to screen readers.

**Rationale for Refinement:** Graying out the image instead of using an 'X' allows users to more easily review their eliminated characters and correct any mistakes, which aligns with our "Intuitive Guidance" principle.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

The following UX pattern decisions will be applied consistently throughout the application to ensure a predictable and intuitive user experience:

*   **Button Hierarchy:**
    *   **Primary Actions:** Solid blue (`#4299E1`) buttons for the main action on a screen (e.g., "Create New Game", "Start Game").
    *   **Secondary Actions:** Solid green (`#48BB78`) buttons for positive secondary actions (e.g., "Play Again", "Yes" in a question).
    *   **Destructive Actions:** A distinct red color (`#E53E3E`) for actions with negative consequences (e.g., "Quit Game", "No" in a question).
*   **Feedback Patterns:**
    *   **Success Messages:** Temporary, non-intrusive "toast" notifications (e.g., "Game code copied!").
    *   **Error Messages:** Displayed directly below the relevant input field for context (e.g., "Invalid game code").
    *   **Loading Indicators:** Subtle spinners or skeleton loaders to indicate content is being fetched or processed.
*   **Modal Patterns:**
    *   **Critical Confirmations:** Use a modal with a dark overlay for high-stakes actions requiring explicit user confirmation (e.g., "Are you sure you want to make a guess?").
    *   **Dismissal:** Non-critical modals can be dismissed by clicking the overlay or pressing the Escape key.

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

The game will be developed as a **Responsive Web Application**, with an initial focus on **PC-web browsers**. The design will ensure a clean and usable layout on desktop screen sizes. While future iterations may expand to tablet and mobile, the current scope prioritizes the desktop experience.

**Accessibility Strategy:**

To ensure the game is usable by a broad audience, we will aim for **WCAG 2.1 Level AA compliance**. This includes:

*   **Keyboard Navigation:** All interactive elements will be operable via keyboard.
*   **Color Contrast:** Sufficient contrast between text and background elements for readability.
*   **Screen Reader Support:** Semantic HTML and ARIA attributes will be used to provide a clear and understandable experience for screen reader users.
*   **Focus Indicators:** Visible focus states will be provided for all interactive elements.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

This UX Design Specification is now complete. It captures the full design direction for the 'Digital Guess Who' game, from high-level principles to detailed user journeys and component strategies.

**Key Deliverables:**

*   **UX Design Specification:** `docs/ux-design-specification.md` (This document)
*   **Interactive Key Screens Showcase:** `docs/ux-design-directions.html`

This document provides a solid foundation for the development phase, ensuring that the final product aligns with the user-centered design decisions made throughout this process.

---

## Appendix

### Related Documents

- Product Requirements: `docs/PRD.md`
- Product Brief: `docs/product-brief-ibe160-2025-11-16.md`
- Brainstorming: `docs/brainstorming-session-results-lørdag 8. november 2025.md`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: [docs/ux-color-themes.html](./ux-color-themes.html)
  - Interactive HTML showcasing the chosen color palette applied to various UI components.

- **Design Direction Mockups**: [docs/ux-design-directions.html](./ux-design-directions.html)
  - Interactive HTML presenting the confirmed design direction across key screens.

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date     | Version | Changes                         | Author        |
| -------- | ------- | ------------------------------- | ------------- |
| torsdag 20. november 2025 | 1.0     | Initial UX Design Specification | BIP |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
