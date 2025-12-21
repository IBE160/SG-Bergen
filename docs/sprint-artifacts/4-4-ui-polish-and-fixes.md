# Story 4.4: UI Polish and Fixes

Status: review

## Story

As a **Player**,
I want **a smoother and safer user experience**,
so that **I don't accidentally quit games and the interface feels more responsive**.

## Acceptance Criteria

1. **Safety:** Clicking "Return to Main Menu" (or "Quit") during an *active* game triggers a confirmation modal.
2. **Cleanliness:** All toast notifications are cleared when navigating away from the game screen.
3. **Visual Feedback:** Character cards have enhanced hover states (lift/shadow) to improve interactivity cues.
4. **Clarity:** Eliminated characters have a more distinct visual state (e.g., specific overlay) beyond just grayscale.

## Tasks / Subtasks

- [x] Task 1: Toast Cleanup (AC 2)
  - [x] Implement `toast.dismiss()` in `handleReturnToMenu` and `useEffect` cleanup.
- [x] Task 2: Quit Confirmation (AC 1)
  - [x] Create `QuitConfirmationModal` component.
  - [x] Integrate into `GameClient` for the "Return to Menu" action when status is 'active'.
- [x] Task 3: Board UX Enhancements (AC 3, AC 4)
  - [x] Update `CharacterCard.tsx` with `hover:-translate-y-1` and shadow classes.
  - [x] Add an overlay icon/style for eliminated state.

## Dev Notes
- Use `sonner` documentation for programmatic dismissal.
- Reuse `AlertDialog` from `shadcn/ui` for the quit modal.

## Change Log
- 2025-12-21: Initial implementation of UI polish stories (Toast, Quit Modal, Board UX).

## Dev Agent Record

### Debug Log
- 2025-12-21: Starting implementation of Task 1 (Toast Cleanup).
- 2025-12-21: Completed Task 1. Added `toast.dismiss()` to navigation handler and unmount cleanup.
- 2025-12-21: Starting Task 2 (Quit Confirmation).
- 2025-12-21: Completed Task 2. Implemented `QuitConfirmationModal` and integrated it into `GameClient` with an "Exit" button in the header.
- 2025-12-21: Starting Task 3 (Board UX Enhancements).
- 2025-12-21: Completed Task 3. Enhanced `CharacterCard` with hover lift, shadow, and a distinct X icon overlay for eliminated characters.
- 2025-12-21: Installed missing `alert-dialog` component from shadcn/ui.
- 2025-12-21: All tasks complete. Regression tests passed.

### Completion Notes
- Implemented toast cleanup on navigation.
- Added a confirmation modal for quitting active games.
- Enhanced the character board visually with hover effects and clearer elimination states.
- Verified regressions with existing integration tests.

### File List
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/app/game-play/components/character-card.tsx
- digital-guess-who/app/game-play/components/quit-confirmation-modal.tsx
- digital-guess-who/components/ui/alert-dialog.tsx


