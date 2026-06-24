# Implemented Features

This document provides a detailed list of every functional and visual feature implemented in the Ziptrrip Todo Application across all development phases (Phases 1–6).

---

## 1. Database & Model Integration
- **MongoDB Connection**: Connects to a MongoDB database instance using mongoose with structured retry connection limits and error boundaries.
- **Todo Model**:
  - `title`: String (Required, trimmed, no empty titles allowed).
  - `description`: String (Optional, details task scope).
  - `completed`: Boolean (Defaults to `false`).
  - `createdAt`: Date (Auto-generated timestamp).

---

## 2. API Server CRUD Features
- **Fetch All Todos**: `GET /api/todos` returns todos sorted dynamically in descending order (`createdAt: -1`) so newest tasks appear at the top.
- **Fetch Todo by ID**: `GET /api/todos/:id` checks for mongoose ObjectID validity before fetching and returning the task.
- **Create Todo**: `POST /api/todos` validates and processes title input to prevent database insertion of blank values.
- **Update Todo**: `PUT /api/todos/:id` allows partial updating of description, title, or completion status with active validators.
- **Delete Todo**: `DELETE /api/todos/:id` deletes task by ID with error recovery structure.

---

## 3. UI/UX Elements
- **Brand Identity & Header**: Sleek top header panel featuring "Ziptrrip Todo App" title styling and absolute path Home links.
- **Modern Typography**: Integrated high-quality Google Fonts (using `Outfit` for bold modern headers, and `Inter` for regular user fields/body text).
- **Glassmorphism & Color Variables**: Utilizes customizable CSS parameters (`--primary`, `--success`, `--danger`, etc.) along with soft gradients and radial backdrops.
- **Card Micro-Animations**: Todo cards float up slightly (`translateY(-2px)`) with glowing shadows on hover.
- **Custom Interactive Checkbox**: Replaced standard browser checkbox inputs with custom HTML-button check elements containing a scaling animated SVG checkmark indicator.

---

## 4. Search Functionality
- **Search Todos by Title**: Filters tasks in real-time on the client side using string containment (`includes()`).
- **Interactive Search Inputs**:
  - Features an inline magnifying glass search SVG icon inside the search input.
  - Contains an absolute-positioned **Clear Search (`×`)** button when text is typed, returning the user instantly to the full list on click.

---

## 5. Loading and Shimmer Screens
- **Skeleton List Loaders**: Shows three skeleton shimmer card templates simulating checkboxes, titles, descriptions, and action buttons during API fetch requests.
- **Skeleton Details Loader**: Details page displays matching title, description, status, and date shimmer lines during fetch.
- **Linear Gradient Keyframe**: Implemented custom `@keyframes shimmer` animation creating smooth side-to-side reflection movement on loaders.

---

## 6. API Transaction Safety (Input Disabling)
- **State Blocking**: Utilizes a helper state `isAnyApiPending` to lock elements while actions compile.
- **Interactive Lock**: Disables check boxes, form submit inputs, edit inputs, save keys, cancel keys, and delete triggers when an API request is in flight.
- **Spinner Buttons**: Submits, updates, and deletes transition to showing a white rotating spinner next to text like `Adding...`, `Saving...`, or `Deleting...`.

---

## 7. Status & Navigation Badges
- **Status Badges**: The details card shows status using modern colored badge pills (`Completed` in light emerald, `Pending` in light yellow) rather than standard text.
- **Created Date Format**: Formats database timestamp into clean locale dates using `en-IN` standards (e.g. `24 June 2026`).
- **Details Routing**: Navigation queries (`/todo?id=<todo_id>`) fetch and load individual details cards correctly.
- **Back Link arrow**: Includes a vector back-arrow icon in header.

---

## 8. Custom Empty States
- **Clipboard Empty State**: If no todos exist in the database, the page renders a clean layout with an illustrative folder/clipboard SVG and prompts user to start.
- **Query Empty State**: If search yields zero matches, renders a search-icon graphic saying "No matching tasks" along with the user's search query inside quotes.

---

## 9. Grid Responsiveness
- Refined responsive flex structures transitioning double columns into full-width stacks on screen resolutions down to 320px.
