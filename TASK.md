# Shared Closet – TASK.md

> Prompt to AI: **“Update TASK.md to mark XYZ as done and add ABC as a new task.”**  
The AI assistant should keep this file up to date as the project progresses.

---

## Conventions

- Use checkboxes `- [ ]` for tasks and `- [x]` for completed.
- Keep tasks **small and actionable** (ideally 0.5–2 hours each).
- Group tasks by **milestones/sprints**.
- When new work is discovered, **add it to the Backlog** and/or the current milestone.
- When a design/architecture decision changes, **also update PLANNING.md**.

---

## Milestone 0 – Planning & Project Setup

**Goal:** Have a clear plan, initialized repo, and basic RN app scaffold running on device/emulator.

- [x] Create `PLANNING.md` with architecture, scope, and data model.
- [x] Create `TASK.md` with structure for ongoing task tracking.
- [ ] Initialize React Native project (preferably Expo, TypeScript template).
- [ ] Set up code structure:
  - [ ] `src/` directory with `screens/`, `components/`, `navigation/`, `hooks/`, `services/`, `types/`.
  - [ ] Install and configure React Navigation (stack + bottom tabs).
- [ ] Integrate Firebase into the app:
  - [ ] Create Firebase project (dev environment).
  - [ ] Add Firebase config to app (environment management).
  - [ ] Install Firebase JS SDK and verify connection.
- [ ] Set up basic theming and global UI components (Button, Text, Screen wrapper).
- [ ] Configure linting/formatting (ESLint + Prettier) and TypeScript strict settings.

---

## Milestone 1 – Authentication & Onboarding

**Goal:** Users can sign up/login with phone number and complete basic profile setup.

- [ ] Implement **phone number auth flow**:
  - [ ] Phone Number Entry Screen (request OTP).
  - [ ] OTP Verification Screen (verify and sign in).
- [ ] After first login, show **Onboarding/Profile Setup Screen**:
  - [ ] Capture name, school/community (e.g., UW–Madison), and profile picture.
  - [ ] Store user in `users` collection (Firestore) with the structure from PLANNING.md.
- [ ] Implement simple **“Auth vs App” routing**:
  - [ ] If user is authenticated & profile is complete → show main app tabs.
  - [ ] Otherwise → show auth/onboarding flow.

---

## Milestone 2 – Closet (My Library)

**Goal:** Users can add, view, and manage items in their own closet.

- [ ] Create **My Closet Screen**:
  - [ ] Display grid/list of user’s `closet_items`.
  - [ ] Basic filters (by category) if time allows.
- [ ] Implement **Add Item Screen**:
  - [ ] Select or take photos (camera/gallery).
  - [ ] Fields: category, size, brand, optional notes.
  - [ ] Upload images to Firebase Storage and store metadata in `closet_items`.
- [ ] Implement **Edit/Delete Item**:
  - [ ] Ability to update item details.
  - [ ] Soft delete (`isActive = false`) instead of hard delete.
- [ ] Connect Closet UI to authenticated user (use `ownerId`).

---

## Milestone 3 – Friends & Social Graph (Basic)

**Goal:** Users can find and add friends, forming the core social graph.

- [ ] Implement **Contacts Sync** (basic):
  - [ ] Ask user for permission to access contacts.
  - [ ] Show a screen listing contacts that match existing app users (simplest version: by phone number).
  - [ ] Let user invite/select contacts as potential friends.
- [ ] Implement **Friend Requests**:
  - [ ] Data structure for `friendships` (`pending`, `accepted`).
  - [ ] Screen for sending friend request to a user.
  - [ ] Screen to view and accept/decline incoming requests.
- [ ] **Friends List Screen**:
  - [ ] Show list of accepted friends.
  - [ ] Navigate to friend detail (for now, optional; used in borrowing/closet view).

---

## Milestone 4 – Borrow Requests

**Goal:** Users can request items from friends’ closets and manage the lifecycle of those requests.

- [ ] Create **Friend Closet View**:
  - [ ] From friends list, tap a friend → see their shared closet items.
- [ ] Implement **Create Borrow Request**:
  - [ ] From friend’s item detail, create a request with:
    - [ ] Start date
    - [ ] End date
    - [ ] Optional note (event, use-case).
  - [ ] Save as `borrow_requests` with `status = "pending"`.
- [ ] Implement **Requests Tab**:
  - [ ] Incoming Requests Screen (requests where current user is `lenderId`).
  - [ ] Outgoing Requests Screen (requests where current user is `borrowerId`).
- [ ] Implement **Update Request Status**:
  - [ ] Lender can accept/decline.
  - [ ] Borrower or lender can mark request as completed (returned).
- [ ] Basic status indicators and filtering by status (pending/active/completed).

---

## Milestone 5 – Private Outfit Feed

**Goal:** Users can post outfits to a private feed visible to friends only and browse friends’ posts.

- [ ] Create **Feed Tab**:
  - [ ] Show list of posts from current user + friends (`visibility = "friends"`).
  - [ ] Basic pagination or infinite scroll.
- [ ] Implement **Create Post Screen**:
  - [ ] Upload photos.
  - [ ] Write caption.
  - [ ] Optionally tag items from user’s own closet.
- [ ] Implement simple **interactions**:
  - [ ] Likes (hearts) on posts.
  - [ ] Optional: simple comments system (if not too time-consuming).
- [ ] Ensure visibility logic is correct: only friends can see a user’s posts.

---

## Milestone 6 – Polish, UX, and Launch Prep

**Goal:** Make the MVP feel coherent and usable for a small group pilot (e.g., UW–Madison).

- [ ] Improve **error handling & loading states** across all screens.
- [ ] Add **empty states** (no items, no friends, no posts, no requests).
- [ ] Add minimal **Settings/Profile** options:
  - [ ] Edit profile (name, photo, community).
  - [ ] Sign out.
- [ ] Basic **analytics hooks** (optional, e.g., log significant events).
- [ ] Manual QA with a small test group.
- [ ] Prepare onboarding instructions for test users (how to sign up, invite friends, etc.).

---

## Backlog / Future Tasks (Not MVP)

These are tasks discovered but intentionally not part of the immediate milestones:

- [ ] Calendar sync to coordinate in-person item exchange times.
- [ ] Receipt scanning to auto-add clothing from purchase receipts.
- [ ] Sync with online purchases (email or e-commerce integrations).
- [ ] Recommendation engine when no friend has the needed item:
  - [ ] Basic product suggestions.
  - [ ] Paid placements where brands can rank higher in recommendations.
- [ ] Paid stylist feature:
  - [ ] Flow for requesting an outfit plan from a stylist.
  - [ ] Stylist dashboard (web or app) for fulfilling requests.
- [ ] Community-level rental marketplace:
  - [ ] Users can post items for paid rental within a community.
  - [ ] Payment integration and platform fee.
- [ ] Push notifications (requests, acceptances, comments/likes, reminders).
- [ ] Advanced privacy controls (per-item visibility, close-friends lists).
- [ ] Reputation or rating system for reliable borrowers/lenders.

---

## Done

- [x] Drafted initial vision, architecture, and MVP scope in `PLANNING.md`.
- [x] Created initial `TASK.md` structure and milestones.

> AI usage note:  
> When you finish a task, mark it as `[x]` here and, if necessary, add follow-up tasks or bugfixes.  
> When new work surfaces during coding, **add it under the relevant milestone or Backlog** instead of silently implementing it.
