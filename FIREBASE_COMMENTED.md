# Firebase Code Commented Out

All Firebase code has been commented out for testing. To re-enable:

1. Uncomment all code marked with `// FIREBASE COMMENTED OUT`
2. Uncomment imports from 'firebase/*'
3. Restore Firebase service initialization in `src/services/firebase.ts`
4. Update AuthContext to use real Firebase auth
5. Uncomment all Firestore/Storage calls in screens

## Quick Mock User Setup

To test the app without Firebase, you can uncomment the mock user in `src/context/AuthContext.tsx`:

```typescript
const mockUser: User = {
  id: 'test-user-1',
  phoneNumber: '+1234567890',
  name: 'Test User',
  school: 'UW-Madison',
  profileImageUrl: '',
  createdAt: new Date(),
  contactsImported: false,
};
```

Then set: `setUser(mockUser)` and `setFirebaseUser({ uid: 'test-user-1' })` in the useEffect.

