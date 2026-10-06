# TaskFlow

TaskFlow is a task and project management app built with React, Vite, Firebase Authentication, and Cloud Firestore. Signed-in users can organize projects and tasks, track priorities and due dates, and review task activity.

## Requirements

- Node.js 20.19+ or 22.12+
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled
- Firebase CLI (`npm install --global firebase-tools`)

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and enter the Firebase web app configuration values.
3. Start the app with `npm run dev`.

The Firebase web API key is public client configuration, not a server secret. Keep authorization in Firebase Security Rules, restrict the API key to the production domains and required Firebase APIs in Google Cloud, and never put Admin SDK credentials in Vite environment variables.

## Firebase setup

1. In Firebase Console, enable Email/Password under Authentication > Sign-in method.
2. Add the local and deployed app domains under Authentication > Settings > Authorized domains.
3. Create the Cloud Firestore database in production mode.
4. Review and deploy `firestore.rules`; the rules scope project, task, and task activity reads/writes to the authenticated owner.
5. Configure the email templates for verification, password reset, and email change. Set the password-reset action URL to the deployed `/forgot-password` route if you want the app's custom password form to handle Firebase's `oobCode`. Without that custom email action handler, Firebase's default action page handles the reset instead.
6. Test registration, verification, login, password reset, profile-name update, email-change verification, and cross-user access using separate test accounts before sharing the deployment.

## Build and deploy

The checked-in `.firebaserc` currently targets the TaskFlow Firebase project. Confirm the project ID before deploying. Use a different project with `firebase use <project-id>` if needed.

```sh
npm run build
firebase login
firebase deploy --only firestore:rules,hosting
```

Firebase Hosting serves the Vite `dist` output, and `firebase.json` rewrites client-side routes to `index.html`. Configure a custom domain in Firebase Hosting if you have one; then add that domain to Authentication's authorized domains and to any API-key referrer restrictions.

## Scripts

- `npm run dev`: start the Vite development server
- `npm run lint`: run Oxlint
- `npm run build`: create the production build in `dist`
- `npm run preview`: preview the production build locally
