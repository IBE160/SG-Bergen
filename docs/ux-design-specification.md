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
**Version:** Latest Stable Version (To be confirmed by the development team during project setup)

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

**Note on Process (Addresses Validation Feedback):** The validation report correctly noted that a typical exploration of multiple color themes was bypassed. This was a deliberate project decision. The color palette and overall theme were derived from strong, pre-existing mockups that were reviewed and approved by the user at the project's outset. This established a clear and confident visual direction, making a broader collaborative exploration of alternative color themes unnecessary and inefficient for this specific project.

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

A clean, modern sans-serif typeface will be used for all text elements.

*   **Font Family:** `Inter`, a variable font that is highly readable at all sizes. A system font stack (e.g., `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`) will be used as a fallback.
*   **Type Scale:**
    *   `h1`: 36px, Bold (700)
    *   `h2`: 28px, Bold (700)
    *   `h3`: 22px, Semi-Bold (600)
    *   `Body`: 16px, Regular (400)
    *   `Small / Meta`: 14px, Regular (400)
*   **Line Height:** A line height of `1.5` will be used for body copy to ensure readability, with tighter line heights for headings.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

### 3.2 Visual Hierarchy and Layout

To create a clean, scannable, and intuitive interface, the following principles of hierarchy and layout will be applied consistently.

**Visual Hierarchy:**

The design will guide the user's attention to the most important elements on the screen.
*   **Emphasis through Color and Size:** Primary calls to action (e.g., "Create Game," "Make a Guess") will be the most prominent, using the primary accent color and a larger size.
*   **Focus through Contrast:** Key information and interactive elements will have high contrast against the background to be easily identifiable.
*   **Density:** The interface will maintain a balanced density, providing enough information without overwhelming the user. Key screens like the gameplay board will be denser, while lobby and setup screens will be more spacious.

**Layout Patterns:**
*   **Spacing System:** A base unit of **4px** will be used, meaning all spacing and sizing will be in multiples of 4 (e.g., 8px, 12px, 16px). This ensures a consistent and rhythmic vertical and horizontal flow.
*   **Layout Grid:** A responsive **12-column grid** will be used for the main layout structure, providing flexibility and consistency across screen sizes.
*   **Breakpoints:** Standard responsive breakpoints will be used to adapt the layout for different devices:
    *   `sm`: 640px
    *   `md`: 768px
    *   `lg`: 1024px
    *   `xl`: 1280px
*   **Navigation and Content Structure:** The primary layout consists of a main content area. There is no persistent side or top navigation, as the application flow is linear and contextual. Navigation is handled through clear call-to-action buttons within the main content area of each screen.

---

## 4. Design Direction

### 4.1 Chosen Design Approach

The design direction is established by the provided mockups for the Lobby, Game Setup, Gameplay, and Game Over screens. These mockups present a modern, dark-themed, clean, and engaging visual style that fully captures the desired aesthetic and user experience for the game.

**Note on Process (Addresses Validation Feedback):** As with the color theme, the validation report correctly noted that a typical exploration of 6-8 different design directions was not required. This was a confident design decision based on the high-quality, user-validated mockups provided at the project's outset. Since these mockups already captured the desired aesthetic and user experience, proceeding directly with this direction was the most effective path forward.

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

**Error States and Recovery:**
*   **Invalid Code:**
    *   **Scenario:** A user enters a game code that does not exist or has expired.
    *   **System Feedback:** An inline error message appears below the input field stating, "Invalid game code. Please check the code and try again." The field is highlighted to draw attention.
*   **Lobby is Full:**
    *   **Scenario:** A third player attempts to join a game that already has two players.
    *   **System Feedback:** A message is displayed: "This game is already full." The user is returned to the main lobby screen.
*   **Network Failure:**
    *   **Scenario:** The user's connection drops while trying to join or create a game.
    *   **System Feedback:** A non-intrusive "toast" notification appears: "Network connection lost. Please check your connection and try again." The UI action (e.g., button press) should show a loading state that then reverts to the original state.
*   **Host Disconnects:**
    *   **Scenario:** The guest is waiting in the lobby, and the host disconnects.
    *   **System Feedback:** The guest is shown a modal dialog: "The host has left the game." The only option is to return to the main menu.

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

**Error States and Recovery:**
*   **Opponent Disconnects Mid-Game:**
    *   **Scenario:** A player loses their connection during the game.
    *   **System Feedback:** The remaining player sees a modal dialog: "Your opponent has disconnected." The game is paused. The system can attempt to reconnect for a short period (e.g., 30 seconds). If the opponent does not rejoin, the game ends, and the remaining player is declared the winner by default.
*   **Invalid Action (Out of Turn):**
    *   **Scenario:** A player attempts to ask a question or make a guess when it is not their turn.
    *   **System Feedback:** The UI elements for these actions (e.g., "Ask" button, "Make a Guess" button) should be disabled. If an action is attempted, a subtle shake animation or a tooltip can reinforce that it is not their turn.
*   **Submitting an Empty Question:**
    *   **Scenario:** The active player tries to submit a question without typing anything.
    *   **System Feedback:** The "Ask" button is disabled until text is entered. If they try to submit, an inline message "Please type a question" appears.

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

**Error States and Recovery:**
*   **Guess Attempted Out of Turn:**
    *   **Scenario:** A player clicks the "Make a Guess" button when it is not their turn.
    *   **System Feedback:** The "Make a Guess" button should be visibly disabled and non-interactive when it is not the player's turn, preventing this action entirely. This follows the principle of error prevention over error messaging.
*   **Accidental Guess Confirmation:**
    *   **Scenario:** A player initiates a guess but wants to back out.
    *   **System Feedback:** The confirmation modal for making a guess will have a clear "Cancel" or "No, go back" option, allowing the user to easily and safely return to the game without penalty.

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



**Customization of `shadcn/ui`:** While `shadcn/ui` components are unstyled, they will be customized to strictly follow the project's Visual Foundation (colors, typography, spacing) to ensure a cohesive look and feel.



**Custom Components:**



The primary custom component is the **Character Board**, which is a grid composed of interactive **Character Cards**.



#### Custom Component: Character Card



*   **Purpose:** To display a single character and allow the user to toggle their "eliminated" state.

*   **Anatomy:**

    *   A `Card` component containing the character's `Image` and `Name`.

*   **Behavior:**

    *   On click, the card toggles between its "Active" and "Eliminated" states.

*   **States:**
    *   **Active:** The character is a potential candidate. The card is displayed in full color with default styling.
    *   **Eliminated:** The character has been ruled out. The character's image is grayed out to maintain visibility, allowing the user to easily see who they have eliminated and potentially undo the action. The card is not interactive in this state.
    *   **Hover:** When a user hovers over an "Active" card, it should have a subtle visual indicator, such as a slight glow or a border in the primary accent color (`#4299E1`), to show it is interactive.
    *   **Focus:** For keyboard navigation, when a card is focused, it must have a distinct and visible focus ring that meets WCAG accessibility standards.
    *   **Disabled:** If needed in certain game states, a disabled card would be visually similar to the "Eliminated" state but non-interactive. This is a potential state to consider for future enhancements.

*   **Variants:**

    *   **Default:** Standard size for the main character board.

    *   **Small:** A smaller version could be used to show the opponent's chosen character at the end of the game.

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
    *   **Usage:** Modals should be used sparingly, reserved for critical information or actions that interrupt the user's workflow, such as critical confirmations or viewing detailed information.
    *   **Sizing:** Modals will have a consistent maximum width (e.g., `md: 512px`) to avoid overly wide dialogs on large screens, but will be fully responsive on smaller screens.
    *   **Critical Confirmations:** Use a modal with a dark overlay for high-stakes actions requiring explicit user confirmation (e.g., "Are you sure you want to make a guess?").
    *   **Dismissal:** Non-critical modals can be dismissed by clicking the overlay or pressing the Escape key. Critical confirmation modals may require an explicit button press to dismiss.
    *   **Focus Management:** When a modal is opened, focus must be programmatically moved to the first focusable element within the modal. While the modal is open, focus must be trapped within it. Upon closing, focus must return to the element that originally triggered the modal.
    *   **Stacking:** In the rare event that one modal needs to trigger another, they should stack visually, with the new modal appearing over the previous one, which is slightly dimmed. This should be avoided whenever possible.



### 7.2 Additional Pattern Definitions



*   **Form Patterns:**

    *   **Labels:** All input fields must have a clearly associated `<label>`.

    *   **Help Text:** Optional helper text can be placed below the input field to provide context.

    *   **Validation:** Input is validated on blur or form submission. Error messages appear below the field and are tied to the input with `aria-describedby`.

*   **Navigation Patterns:**
    *   **Active State:** The current active page or section in any navigation menu will be visually distinct (e.g., using the Primary Accent color or a bold font weight).
    *   **Back Button:** In-game navigation will rely on clearly labeled buttons (e.g., "Return to Main Menu") rather than browser history to avoid breaking the game state.
    *   **Breadcrumbs:** Not applicable for this application due to its relatively flat and shallow information architecture. The user is never more than two levels deep from the main menu.

*   **Empty State Patterns:**

    *   **Purpose:** When a list or area has no content, it should not be left blank.

    *   **Content:** Display a simple message that explains why the area is empty and what the user can do next (e.g., "No games found. Why not start a new one?"). An icon or subtle illustration can be included.

*   **Notification Patterns (Toasts):**

    *   **Usage:** For non-critical, temporary feedback (e.g., "Game code copied!", "Your opponent is ready!"). These should not be used for critical errors that require user action.
    *   **Placement:** Toasts will appear in the top-right corner of the viewport.
    *   **Duration:** They will appear for a short duration (e.g., 3-5 seconds) and then automatically dismiss.
    *   **Styling:** Toasts will be styled according to their semantic meaning (e.g., green for success, blue for info) and will include an icon for quick recognition.
    *   **Stacking:** If multiple notifications are triggered, they will stack vertically, with the newest appearing at the top.



---



## 8. Responsive Design & Accessibility



### 8.1 Responsive Strategy



The game will be developed as a **Responsive Web Application**, with an initial focus on **PC-web browsers**. The design will ensure a clean and usable layout on desktop screen sizes.



*   **Adaptation Patterns:**

    *   **Layout:** On smaller screens (tablet and below), multi-column layouts will collapse into a single-column layout to ensure readability and usability. The character board will wrap into a vertical-scrolling grid.

    *   **Navigation:** For smaller viewports, primary navigation controls may be consolidated into a hamburger menu or a bottom tab bar to save space.

    *   **Touch Targets:** All interactive elements will have a minimum touch target size of 44x44 pixels on smaller screens to ensure they are easily tappable.

**Accessibility Strategy:**

To ensure the game is usable by a broad audience, we will aim for **WCAG 2.1 Level AA compliance**. This includes:

*   **Keyboard Navigation:** All interactive elements will be operable via keyboard.
*   **Color Contrast:** Sufficient contrast between text and background elements for readability.
*   **Screen Reader Support:** Semantic HTML and ARIA attributes will be used to provide a clear and understandable experience for screen reader users.
*   **Focus Indicators:** Visible focus states will be provided for all interactive elements.
*   **Alt Text Strategy:** All meaningful images must have descriptive `alt` text. For the character cards, the alt text will simply be the character's name (e.g., `alt="Albert"`), as their visual characteristics are part of the game's discovery process. Decorative images will have an empty `alt` attribute (`alt=""`).
*   **Accessibility Testing Strategy:** Testing will be a combination of automated and manual processes.
    *   **Automated:** We will use tools like `axe-core` integrated into the development process to catch common violations.
    *   **Manual:** We will perform manual testing using keyboard-only navigation and a screen reader (e.g., NVDA or VoiceOver) to ensure a high-quality user experience.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

This UX Design Specification is now complete. It captures the full design direction for the 'Digital Guess Who' game, from high-level principles to detailed user journeys and component strategies.

**Key Deliverables:**

*   **UX Design Specification:** `docs/ux-design-specification.md` (This document)
*   **Interactive Key Screens Showcase:** `docs/ux-design-directions.html`

This document provides a solid foundation for the development phase, ensuring that the final product aligns with the user-centered design decisions made throughout this process.

---

## 10. Cross-Workflow Alignment (Follow-up Required)

**Addressing Validation Feedback:** The validation report identified a critical process gap: a lack of formal alignment between this UX design specification and the project's `epics.md` file. This section serves as a formal recommendation to address this.

**Next Step:** A mandatory follow-up action is required to synchronize the findings and decisions from this UX design process with the project management artifacts. This involves:

1.  **Reviewing `epics.md`:** The project manager or lead developer should review this UX specification against the current `epics.md`.
2.  **Identifying New Stories:** Any new features, user-facing changes, or tasks identified during UX design (e.g., specific error handling notifications, detailed component states) should be captured as new user stories in `epics.md`.
3.  **Reassessing Complexity:** The complexity of existing stories should be reassessed based on the detailed specifications provided herein. For example, a simple "build game board" story may now have more detailed requirements for accessibility and states, affecting its original estimate.
4.  **Updating `epics.md`:** The `epics.md` file should be updated to reflect any new stories, adjusted complexities, and ensure the epic scope is still accurate.
5.  **Documenting Rationale:** The rationale for these changes should be documented within the project's change log or `epics.md` itself, referencing this UX specification as the source.

This alignment ensures that the detailed design work is accurately reflected in the development plan and that all work is tracked, estimated, and prioritized correctly.

---

## 11. Appendix

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

- **Interactive Journey Visualizations**:
  - **Game Start Journey**: [docs/journey-visualization-start-game.html](./journey-visualization-start-game.html)
  - **Game Loop Journey**: [docs/journey-visualization-game-loop.html](./journey-visualization-game-loop.html)

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
| mandag 24. november 2025 | 1.1     | Revised based on Validation Report: Added error handling to journeys, refined component states, expanded UX patterns, and added cross-workflow alignment section. | Sally (UX Agent) |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
