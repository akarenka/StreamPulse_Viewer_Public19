# StreamPulse Android (Play Store release project)

Package: `com.akarenka.streamingpulse`  
Website: `https://streamingpulse.netlify.app/`

## Included

- Secure HTTPS WebView for the existing StreamPulse site
- Firebase Email/password and Google sign-in
- Google Play subscriptions: `streampulse_monthly_190` and `streampulse_yearly_2080`
- Server-side Google Play Developer API validation
- Firestore entitlements shared across devices
- 15-second free state and premium entitlement bridge to the website
- Release AAB build configuration

## Required before a working release

1. Register a Google Play Console developer account and create an app with package `com.akarenka.streamingpulse`.
2. Create monthly and yearly subscriptions with the exact product IDs above. Configure Taiwan prices as NT$190 and NT$2,080.
3. Create a Firebase project, add this Android app, enable Email/Password and Google authentication, then download `google-services.json` into `app/`.
4. Deploy `backend/index.js`, deploy `backend/firestore.rules`, and grant the Functions service account access to the Google Play Android Developer API.
5. Replace `REPLACE_WITH_CLOUD_FUNCTION_URL` in `app/build.gradle`.
6. Add the Play App Signing SHA-1 and SHA-256 certificates to Firebase.
7. Generate a private upload key. Never commit the key or passwords.

## Build AAB

Open this folder in Android Studio, allow Gradle sync, then use **Build > Generate Signed Bundle / APK > Android App Bundle**. The output is normally under `app/build/outputs/bundle/release/`.

The example Firebase file is intentionally non-functional. A real AAB with login and Billing cannot be tested until Play Console and Firebase have been configured.
