# Next.js Firebase App Template

A reusable Next.js 16 starter with Firebase, Tailwind CSS, and shadcn/ui.

The template includes email/password and Google authentication, persistent server sessions, protected dashboard routes, root-admin provisioning, logout, and account deletion.

## 1. Install the template

```bash
npm install
cp env.example .env.local
```

Keep `.env.local` open while completing the Firebase steps below.

## 2. Create the Firebase project and Web app

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create or select a project.
3. From **Project overview**, click the Web icon.
4. Name and register the Web app. Firebase Hosting is optional.
5. Copy the app configuration into these `.env.local` fields:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_FIREBASE_APP_ID=""
   ```

You can find these values again under **Project settings → General → Your apps**.

## 3. Create the service-account key

Stay in **Project settings**, then:

1. Open **Service accounts → Firebase Admin SDK**.
2. Confirm that the project matches the Web app project.
3. Click **Generate new private key**.
4. Map the downloaded JSON values into `.env.local`:

   | JSON field | Environment variable |
   | --- | --- |
   | `project_id` | `FIREBASE_PROJECT_ID` |
   | `client_email` | `FIREBASE_CLIENT_EMAIL` |
   | `private_key` | `FIREBASE_PRIVATE_KEY` |

   ```env
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-abcde@your-project-id.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

`NEXT_PUBLIC_FIREBASE_PROJECT_ID` and `FIREBASE_PROJECT_ID` must match. Keep the private key's `\n` characters when it is stored on one line.

Never commit the downloaded JSON or `.env.local`, expose Admin values through `NEXT_PUBLIC_` variables, or place credentials under `public/`. Store production credentials in your deployment platform's encrypted environment settings.

## 4. Set up Firebase Authentication

Open **Build → Authentication**:

1. Click **Get started**.
2. Under **Sign-in method**, enable **Email/Password**.
3. Enable **Google** and choose a support email.
4. Under **Settings → Authorized domains**, add:
   - `localhost`
   - Your staging hostname
   - Your production hostname

Enter hostnames without `https://` or a path.

No separate Google Client ID environment variable is needed. Firebase manages it for the planned `GoogleAuthProvider` and `signInWithPopup` flow.

Set the initial root administrator in `.env.local`:

```env
ROOT_EMAIL="owner@example.com"
```

`ROOT_EMAIL` is server-only. When authentication is implemented, the server will compare it with the verified Firebase email while creating a user's Firestore profile for the first time. A match receives the `admin` role; every other account receives the `user` role. Role values sent by the browser will never be trusted. Use an email/password or Google account whose verified email exactly matches this value, ignoring capitalization and surrounding spaces.

## 5. Create Cloud Firestore

Open **Build → Firestore Database**:

1. Click **Create database**.
2. Use the default database ID and Standard edition.
3. Select the region closest to the application and its users.
4. Choose **Production mode**.
5. Create the database.
6. Under **Rules**, confirm that access is denied by default:

   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

Add collection-specific rules as the data model is built. The Admin SDK bypasses Firestore Security Rules, so server operations must perform their own authorization checks.

## 6. Customize the app

Set the application values in `.env.local`:

```env
APP_NAME="AppName"
APP_LOGO_URL="/images/logo.png"
APP_EYEBROW="Your workspace, simplified"
APP_TITLE="Everything you need, all in one place."
APP_DESCRIPTION="A clear, focused home for your team to move work forward and stay in sync."
```

Files under `public` use root-relative paths. For example, `public/images/logo.png` is `/images/logo.png`. The UI uses its default icon when the configured image is missing.

### Replace the favicon

Replace [`src/app/favicon.ico`](src/app/favicon.ico) with your favicon and keep the filename exactly `favicon.ico`. Next.js detects this App Router metadata file automatically and adds it to the document head, so no setting or manual `<link>` tag is required.

The replacement must be a real ICO file, not a PNG renamed with an `.ico` extension. For good browser coverage, export a multi-size ICO containing at least 16×16, 32×32, and 48×48 versions; including larger sizes such as 64×64, 128×128, and 256×256 is also useful.

The file at `public/favicon.ico` is not the active favicon while `src/app/favicon.ico` exists. Use `src/app/favicon.ico` as the single source of truth. After replacing it, restart the development server and hard-refresh the page or clear the browser favicon cache if the previous icon remains visible.

## 7. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run lint
npm run build
npm run start
```

## Authentication behavior

Email/password and Google login both produce a Firebase ID token. The server exchanges that token for a persistent, secure session cookie and redirects the user to `/dashboard`.

The cookie name and lifetime are application security policy defined in the authentication code. The cookie uses `httpOnly`, `secure` in production, `sameSite`, and a `maxAge` so closing the browser does not end the session.

Returning users will be handled in two stages:

1. If the server cookie is valid, the server redirects directly to `/dashboard` before rendering the login page.
2. If the server cookie expired but Firebase still has a persistent browser session, the login screen briefly checks Firebase, obtains a fresh ID token, recreates the server cookie, and redirects automatically.

Firebase session cookies have a maximum lifetime of two weeks. Firebase browser persistence allows the app to restore the server session gracefully after that cookie expires. Explicit logout clears both the Firebase browser session and the server cookie.

`src/proxy.ts` performs quick cookie-based redirects for protected routes. It is not the security boundary: protected layouts and endpoints verify the cookie with Firebase Admin before accessing protected data. Invalid sessions return to the login page without creating a redirect loop.

Administrators can use **Dashboard → User management** to search Firebase accounts, assign admin or user roles, suspend or reactivate access, and permanently delete accounts. Suspended users cannot sign in and see a specific suspension message. The current administrator and configured `ROOT_EMAIL` account are protected from these operations.

## Optional: local Firebase emulators

Set these values in `.env.local`:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR="true"
FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
```

Then install and configure the Firebase CLI:

```bash
npm install --global firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

Select the Authentication and Firestore emulators. Never set `FIREBASE_AUTH_EMULATOR_HOST` in production.

## Deployment checklist

- Add all `.env.local` values to the deployment environment.
- Keep Firebase Admin credentials server-only.
- Set `ROOT_EMAIL` to the verified account that should receive the initial admin role.
- Under **Firebase Authentication → Settings → Authorized domains**, add every production hostname that serves the login page.
- Under **Firebase Authentication → Sign-in method**, make sure Google is enabled before deploying Google sign-in.
- Keep `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` set to `<project-id>.firebaseapp.com` in normal deployments; the app's production hostname belongs in **Authorized domains**, not in this variable.
- Redeploy Vercel after changing any `NEXT_PUBLIC_*` variable. Next.js embeds these values in the browser bundle at build time.
- Make sure `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` and `FIREBASE_AUTH_EMULATOR_HOST` are disabled or absent in production.
- Run `npm run lint` and `npm run build`.
- Test email/password login, Google login, logout, and protected routes.

## References

- [Firebase Web setup](https://firebase.google.com/docs/web/setup)
- [Firebase Admin setup](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
- [Google authentication](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
- [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy)
