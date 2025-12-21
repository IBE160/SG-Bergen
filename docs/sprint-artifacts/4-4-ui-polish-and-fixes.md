# Story 4.4: UI Polish and Fixes

Status: drafted

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

- [ ] Task 1: Toast Cleanup (AC 2)
  - [ ] Implement `toast.dismiss()` in `handleReturnToMenu` and `useEffect` cleanup.
- [ ] Task 2: Quit Confirmation (AC 1)
  - [ ] Create `QuitConfirmationModal` component.
  - [ ] Integrate into `GameClient` for the "Return to Menu" action when status is 'active'.
- [ ] Task 3: Board UX Enhancements (AC 3, AC 4)
  - [ ] Update `CharacterCard.tsx` with `hover:-translate-y-1` and shadow classes.
  - [ ] Add an overlay icon/style for eliminated state.

## Dev Notes
- Use `sonner` documentation for programmatic dismissal.
- Reuse `AlertDialog` from `shadcn/ui` for the quit modal.
