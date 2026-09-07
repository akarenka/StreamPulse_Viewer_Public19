# StreamPulse Web v33.2 — JavaScript Login

This build removes the Android native authentication bridge and performs login entirely in the website with Firebase JavaScript SDK.

## Login behavior

- Desktop browsers: `signInWithPopup()`
- Phones and narrow screens: `signInWithRedirect()`
- If a popup is blocked: automatic fallback to `signInWithRedirect()`
- Firebase authentication persistence: `LOCAL`
- Live Room Google and Email/Password login remain available.

The following Android bridge APIs are no longer required:

- `window.StreamPulseNativeViewerAuth`
- `window.StreamPulseNativeAuth`
- `window.StreamPulseApp.requestLogin()`
- Native ID-token or custom-token injection

## Firebase Console

1. Enable Google in Authentication > Sign-in method.
2. Add `streamingpulse.netlify.app` to Authentication > Settings > Authorized domains.
3. Keep `firebase-config.js` in the website root.
4. Deploy all files in this `web-release` folder together.

Google may reject OAuth inside an embedded Android WebView. This JavaScript-only build is intended for normal Chrome, Samsung Internet, Safari, Firefox, and other supported browsers. An Android shell should open the login website in a supported external browser when WebView OAuth is blocked.
