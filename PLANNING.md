# Shared Closet – PLANNING.md

> Prompt to AI: **“Use the structure and decisions outlined in PLANNING.md.”**  
Always read this file before making architecture or feature decisions.

---

## 1. Product Vision

### 1.1 Problem

College students constantly need clothes for:

- Cultural events (e.g., Indian clothes)
- Themed/costume parties
- Professional events (career fairs, interviews)

They often overbuy, underuse, and waste money. Fashion consumption is unsustainable, and students already borrow from friends in informal, messy ways (DMs, group chats, last-minute scrambling).

### 1.2 Solution (High-Level)

A **React Native mobile app** that lets students:

- Maintain a **digital closet** of their wardrobe
- Connect with friends via a **shared closet network**
- **Request and lend** specific pieces of clothing
- Share outfits on a private **social feed** for inspiration and discovery

Long term, the app can also:

- Suggest **sustainable purchase recommendations** when no one in your network has the item
- Offer **stylist services** based on your existing closet
- Enable **community rentals** (earn money by renting out clothes)

### 1.3 Target Users

- Primary: College students (example: UW–Madison), especially:
  - People going to cultural events (e.g., desi/Indian events)
  - Sorority/fraternity members
  - Students needing one-off professional outfits
- Secondary (later): Young professionals in their 20s in the same city.

### 1.4 Goals (MVP)

- Make it **easy to see what clothes you and your friends own**.
- Make it **simple to request/lend** specific items.
- Provide a lightweight **social layer** (outfit posting & inspiration) in a **trusted circle** (friends).

Success indicators (qualitative at first):

- Number of items added to closets
- Number of friend connections
- Number of borrow requests created and marked as completed
- Daily/weekly active users per community (e.g., UW–Madison)

---

## 2. Scope – MVP vs. Future Phases

### 2.1 MVP v0.1 (Narrow but usable)

**Must-have flows:**

1. **Authentication**
   - Phone number signup/login (OTP-based).  
   - Basic profile: name, school, profile photo, preferred community (e.g., UW–Madison).

2. **Closet / Library**
   - View your own library of items.
   - Add a clothing item:
     - Upload one or more photos from camera or gallery.
     - Select clothing type/category.
     - Enter metadata: size, brand, optional notes (color, fit).
   - Edit or soft-delete an item.

3. **Friends & Social Graph (basic)**
   - Sync contacts (read-only, user selects which contacts to invite).
   - Send/accept friend requests (only within app users).
   - View list of friends.

4. **Borrow Requests**
   - Choose a friend → see their public closet items.
   - Request a specific item (with date range and optional note).
   - View incoming/outgoing requests.
   - Accept / decline requests.
   - Mark request as “completed/returned”.

5. **Private Outfit Feed**
   - Post an outfit:
     - Use one or more photos (optionally tag items from your closet).
     - Caption.
   - Display a feed visible to friends only (similar to a private story).
   - Basic interactions: likes (hearts) and simple comments (optional for MVP if time allows).

6. **Communities**
   - Store user’s **primary community** (e.g., UW–Madison).
   - Initially, community is informational only (for future filtering/expansion).
   - No complex community management yet.

### 2.2 Future / Non-MVP Features

These are explicitly **out of MVP** but should be kept in mind while designing data models:

- **Public boards / explore feed** beyond friends.
- **Calendar sync** to cross-check availability windows for item exchange.
- **Receipt scanning** to auto-add items to closet.
- **Sync with online purchases** from email or e-commerce integrations.
- **Recommendation engine** when no friend has the item:
  - Sustainable/secondhand options
  - Paid placements for brands who want to surface their items.
- **Paid stylist services**:
  - Users pay to have stylists pick outfits from their existing closet (plus suggested additions).
- **Rental marketplace** beyond friends:
  - Users join city/school communities (e.g., UW–Madison) and rent out pieces.
  - Platform takes a percentage of each transaction.
- **Push notifications** for request updates, new posts, reminders, etc.

---

## 3. User Stories (MVP)

### 3.1 Closet

- As a student, I want to **digitize my closet** so I can see what I own at a glance.
- As a student, I want to **upload photos** and basic details (size, brand) so my friends know if something will fit them.
- As a borrower, I want to **view my friend’s closet** so I can easily find what to request.

### 3.2 Friends & Social

- As a student, I want to **find friends using my contacts** so I don’t have to search manually.
- As a student, I want to **approve friend requests** so I control who sees my closet and outfits.
- As a student, I want to **see outfits my friends post** so I get inspiration and can ask to borrow specific items.

### 3.3 Borrow Requests

- As a borrower, I want to **request a specific item** for a specific time period.
- As a lender, I want to **accept or decline** a request easily.
- As a lender, I want to **see all upcoming and active loans** so I know what I’ve promised out.
- As both parties, I want to **mark an item as returned** to keep things organized.

---

## 4. Technical Architecture

### 4.1 Platform & Stack

- **Frontend**: React Native
  - Likely via Expo for faster iteration (unless native modules require bare RN later).
  - Language: **TypeScript**
- **Navigation**: React Navigation
  - Auth stack + main tab navigator.
- **State Management**:
  - Start with React Context + hooks.
  - Consider Zustand/Recoil later if complexity grows.
- **Backend (initial choice)**:
  - **Firebase** (assumption; can be changed if needed)
    - Firebase Auth (phone number authentication).
    - Firestore (NoSQL database).
    - Firebase Storage (images).
- **CI/CD**: Not required for MVP, but Expo EAS builds later if desired.

> AI: If this backend choice changes (e.g., to Supabase/Appwrite/custom Node backend), update this section and related data modeling.

### 4.2 Data Model (Draft)

Collections (Firestore-style; can be adapted):

- **users**
  - `id`
  - `phoneNumber`
  - `name`
  - `school` / `community` (e.g., `UW-Madison`)
  - `profileImageUrl`
  - `createdAt`
  - `contactsImported` (bool)

- **closet_items**
  - `id`
  - `ownerId` (ref → users)
  - `images` (array of URLs)
  - `brand`
  - `size`
  - `category` (e.g., saree, blazer, dress, shoes)
  - `notes` (color, fit, etc.)
  - `isActive` (soft delete)
  - `createdAt`

- **friendships**
  - `id`
  - `userAId`
  - `userBId`
  - `status` (`pending`, `accepted`, `blocked`)
  - `createdAt`

- **borrow_requests**
  - `id`
  - `itemId` (ref → closet_items)
  - `borrowerId`
  - `lenderId`
  - `startDate`
  - `endDate`
  - `status` (`pending`, `accepted`, `declined`, `cancelled`, `completed`)
  - `notes`
  - `createdAt`

- **posts**
  - `id`
  - `authorId`
  - `imageUrls` (array)
  - `caption`
  - `taggedItemIds` (optional)
  - `visibility` (`friends` for now)
  - `createdAt`

Additional collections for future phases (not MVP but model-friendly):

- **communities** (`id`, `name`, `type`, `location`)
- **stylist_orders**, **brand_recommendations**, **rentals** etc.

---

## 5. Navigation & Screens (MVP)

### 5.1 Navigation Structure

- **Auth Stack**
  - Phone Entry Screen
  - OTP Verification Screen
  - Onboarding/Profile Setup Screen

- **Main App (Tab Navigator)**
  1. **Closet Tab**
     - My Closet Screen
     - Add/Edit Item Screen
  2. **Feed Tab**
     - Friends’ Outfits Feed
     - Create Post Screen
  3. **Requests Tab**
     - Incoming Requests Screen
     - Outgoing Requests Screen
     - Request Detail Screen
  4. **Profile/More Tab**
     - My Profile Screen
     - Friends List / Add Friends Screen
     - Settings (sign out, privacy, etc.)

---

## 6. Permissions & Integrations

- **Required (MVP)**
  - Camera + Photo Library (uploading clothing & outfits).
  - Contacts (optional, user-consented) to find friends.

- **Later**
  - Calendar access (for scheduling & availability).
  - Push notifications.

---

## 7. Non-Functional Requirements

- **Security & Privacy**
  - Only friends should be able to view user closets and feed (for now).
  - No internal sharing of phone numbers beyond what’s necessary for auth and minimal friend discovery.
  - Provide simple privacy controls later (e.g., hide certain items from general friend view).

- **Performance**
  - Optimized image loading (thumbnails, lazy load).
  - Pagination/limit for feed and lists.

- **Reliability**
  - Handle offline/poor network gracefully when adding items (queue uploads).

---

## 8. Constraints & Assumptions

- Initial launch focused on **one campus (e.g., UW–Madison)**.
- iOS and Android only, via React Native.
- Small, student-scale user base initially (no heavy scaling constraints in MVP).
- We assume Firebase is acceptable (no strict vendor lock-in constraints).

---

## 9. Open Questions (for future planning)

- How will we handle **damaged/lost items** or disputes (beyond MVP)?
- Do we need **rating/reputation** for borrowers/lenders?
- How granular should **privacy controls** be for items (e.g., “friends only”, “close friends”, “community”)?
- What early **monetization experiments** are we comfortable building (brand recs, rentals, stylists), and when?

> AI usage note:  
> When new decisions are made (e.g., backend swap, new navigation, changed data model), **update this PLANNING.md first**, then proceed with implementation.
