---
epic: "Epic 1: Game Setup & Core UI"
story: "As a developer, I want to set up a UI library and define global styles so that we have a consistent and efficient way to build the user interface."
status: "review"
---

# Sprint Artifact: UI Library and Global Styles Setup

This document outlines the setup of the UI library and global styling for the "Digital Guess Who" project. This work establishes the foundational design system for building a consistent and modern user interface.

## 1. UI Library: Shadcn/UI

- **Library:** [Shadcn/UI](https://ui.shadcn.com/) was selected as the primary component library.
- **Reasoning:** Shadcn/UI is not a traditional component library. It provides beautifully designed, accessible components that are added individually to the project. This approach gives us full control over the code, styling, and behavior of each component, avoiding monolithic library bloat and promoting a highly customizable design system. It is built on top of Radix UI primitives and styled with Tailwind CSS, which aligns perfectly with our chosen stack.
- **Implementation:** Components are located in `digital-guess-who/components/ui`. They are added to the project via the `shadcn-ui` CLI as needed.

## 2. Styling Framework: Tailwind CSS

- **Framework:** [Tailwind CSS](https://tailwindcss.com/) is used for all styling.
- **Reasoning:** Tailwind CSS is a utility-first CSS framework that allows for rapid UI development directly in the markup. It enables the creation of a highly consistent design language, reduces the need for custom CSS, and is easily configurable.
- **Configuration:** The main configuration is in `digital-guess-who/tailwind.config.ts`. This file is set up to process all source files and includes the `tailwindcss-animate` plugin for animations.

## 3. Global Styles and Theming

- **Global Styles:** The primary global stylesheet is located at `digital-guess-who/app/globals.css`.
- **Theming:** The application is configured with a light and a dark theme.
  - Theme switching is managed by the `next-themes` package.
  - Theme colors are defined as CSS variables within `app/globals.css` under the `:root` (light theme) and `.dark` (dark theme) selectors. This convention is used by Shadcn/UI and allows for easy and dynamic theme application across all components.
  - The variables control background colors, foreground (text) colors, card styles, accents, and more, ensuring a consistent look and feel for both themes.

## Conclusion

The setup of Shadcn/UI with Tailwind CSS provides a robust and flexible foundation for the project's user interface. Developers can now efficiently build and style new features while maintaining design consistency across the application. This task is complete.