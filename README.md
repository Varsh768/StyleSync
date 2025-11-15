# StyleSync - Shared Closet App

A React Native mobile app that lets college students maintain a digital closet, connect with friends, and borrow/lend clothing items.

## Features

- **Digital Closet**: Upload and manage your clothing items with photos and details
- **Friend Network**: Connect with friends and view their closets
- **Borrow Requests**: Request to borrow items from friends with date ranges
- **Private Feed**: Share outfit posts visible only to friends
- **Phone Authentication**: Secure signup/login with phone number OTP

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **Firebase** (Auth, Firestore, Storage)
- **React Navigation**
- **Expo Image Picker & Camera**

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StyleSync
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Phone Authentication
   - Create Firestore database
   - Create Storage bucket
   - Copy your Firebase config

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your Firebase configuration to `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

6. Update Firebase config in `src/services/firebase.ts` if needed

7. Start the development server:
```bash
npm start
```

8. Run on device/emulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
src/
  ├── screens/          # Screen components
  │   ├── auth/        # Authentication screens
  │   ├── closet/       # Closet management screens
  │   ├── feed/         # Outfit feed screens
  │   ├── requests/     # Borrow request screens
  │   └── profile/      # Profile and settings screens
  ├── components/       # Reusable components
  ├── navigation/       # Navigation configuration
  ├── context/          # React Context providers
  ├── services/         # Firebase and API services
  ├── types/            # TypeScript type definitions
  └── utils/            # Utility functions
```

## Firebase Collections

- `users` - User profiles
- `closet_items` - Clothing items
- `friendships` - Friend relationships
- `borrow_requests` - Borrow requests
- `posts` - Outfit posts

## Development

### Running the app

```bash
npm start
```

### Building for production

```bash
expo build:android
expo build:ios
```

## Notes

- Phone authentication requires Firebase Phone Auth setup
- Image uploads require Firebase Storage configuration
- Contacts access requires user permission
- Camera access requires user permission

## License

MIT
