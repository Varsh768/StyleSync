# StyleSync Setup Guide

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Phone Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Phone** provider
3. For testing, add test phone numbers in the Firebase Console
4. Note: Phone auth requires additional setup for production (App Check, reCAPTCHA)

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location

### 4. Create Storage Bucket

1. Go to **Storage**
2. Click "Get started"
3. Start in **test mode** (for development)
4. Choose a location

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Copy the config values
5. Add them to your `.env` file

### 6. Firestore Security Rules (Development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Storage Security Rules (Development)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase config
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator / `a` for Android emulator

## Testing Phone Authentication

For development, you can use test phone numbers:

1. Go to Firebase Console > Authentication > Sign-in method > Phone
2. Add test phone numbers
3. Use the test OTP codes shown in the console

## Common Issues

### Phone Auth Not Working
- Ensure Phone provider is enabled in Firebase Console
- Check that reCAPTCHA is properly configured
- For web, you may need to set up reCAPTCHA verifier

### Image Upload Fails
- Check Storage bucket permissions
- Verify Storage rules allow authenticated writes
- Ensure images are not too large

### Firestore Queries Fail
- Check Firestore rules
- Verify indexes are created (Firebase will prompt you)
- Check that user is authenticated

## Next Steps

1. Set up proper security rules for production
2. Configure App Check for additional security
3. Set up push notifications (optional)
4. Configure analytics (optional)

