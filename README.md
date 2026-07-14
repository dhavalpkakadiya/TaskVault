# TaskVault

A secured TODO list React Native app built with Expo Bare Workflow. Add, edit, and delete operations require biometric or device PIN authentication before they run.

## Features

- View, add, edit, and delete todos
- Mark todos complete/incomplete (no auth required)
- Biometric / PIN authentication via `expo-local-authentication`
- Delete confirmation after successful auth
- In-memory state with Redux Toolkit (todos reset on app restart)
- React Navigation native stack (Splash → Home)
- Paidy-inspired UI (magenta accent, light surfaces, charcoal text)

## Authentication Flow

| Action          | Auth required                                       |
| --------------- | --------------------------------------------------- |
| Add todo        | Yes — before the form opens                         |
| Edit todo       | Yes — before the form opens                         |
| Delete todo     | Yes — before confirmation dialog                    |
| Save in modal   | No — modal only opens after a successful auth check |
| Toggle complete | No                                                  |

Failed auth shows an error overlay via `AuthGuard`. Successful writes show a brief snackbar. Delete also asks for confirmation after auth succeeds.

## Design Decisions

**Auth before the modal, not on Save**  
Add and edit authenticate first, then open the form. Save does not re-prompt because the user already proved identity to reach the modal. This matches the assignment requirement while avoiding double prompts.

**Device PIN as fallback**  
`disableDeviceFallback: false` lets users authenticate with passcode when biometrics fail or are unavailable — important for simulators and devices without Face ID / fingerprint enrolled.

**In-memory Redux state**  
Todos live in Redux Toolkit only (no persistence). Data resets on app restart, which keeps the submission focused on the auth gate rather than storage security. For production, encrypted storage (e.g. `expo-secure-store`) would be the next step.

**Delete: auth then confirm**  
Delete requires authentication first, then a native confirmation dialog. This prevents accidental swipe deletes while keeping the sensitive action behind biometrics/PIN.

**Centralized copy and theme**  
All user-facing strings live in `AppStrings`; colors and spacing use `src/theme/`. Easier to review, test, and rebrand.

## Assumptions / Out of Scope

Intentionally left out to keep the submission focused on the security gate:

- **No persistence** — todos reset on restart (in-memory Redux only)
- **No filters / search / reorder** — core CRUD + auth only
- **Auth at the UI layer** — `useHome` gates add/edit/delete before dispatch; not Redux middleware
- **Committed native projects** — `android/` and `ios/` are present for bare Expo runs after `prebuild`

## How to Test Authentication

### iOS Simulator

1. Run `yarn ios`.
2. In the Simulator menu: **Features → Face ID → Enrolled**.
3. Trigger add, edit, or delete — choose **Matching Face** or **Non-matching Face** to simulate success/failure.

### Android Emulator

1. Run `yarn android`.
2. Set a screen lock: **Settings → Security → Screen lock** (PIN or pattern).
3. For fingerprint: **Settings → Security → Fingerprint** (emulator extended controls can simulate touch).

### Physical device

Use the device’s real biometrics or PIN. Ensure a passcode is configured under system settings.

### What to verify

- Cancelling auth does **not** open the add/edit modal or delete a task.
- Failed auth shows the error overlay (`AuthGuard`).
- Successful add/edit/delete shows the snackbar.
- Delete: swipe a task left → Delete → authenticate → confirm.

## Project Structure

```
src/
├── components/
│   ├── auth-guard/       # Loading overlay + auth error toast
│   ├── form-text-input/  # Shared modal text field
│   ├── todo-form-modal/  # Add/edit modal
│   ├── todo-item/        # Single todo row
│   └── todo-list/        # Scrollable list with empty state
├── screens/
│   ├── home/             # HomeScreen, useHome hook, styles
│   └── splash/           # SplashScreen
├── redux/todo-slice/     # Redux Toolkit slice (add, update, delete, toggle)
├── store/                # configureStore + RootState types
├── hooks/
│   ├── useAuth.ts        # Local authentication wrapper
│   └── useRedux.ts       # Typed useAppDispatch / useAppSelector
├── interface/            # Todo, AuthResult, navigation types
├── constants/            # AppStrings
├── theme/                # colors, responsive Metrics helpers
├── utils/                # authenticateAsync helper
└── __tests__/            # Jest unit tests (slice, useAuth, useHome, TodoItem)
```

## Getting Started

```bash
yarn install
yarn prebuild          # generates android/ and ios/ native projects
yarn ios               # or yarn android
```

For development without rebuilding native code:

```bash
yarn start
```

## Running Tests

```bash
yarn test
```

Requires `@react-native/jest-preset` (peer dependency of `jest-expo`). Tests run with `--watchman=false` to avoid watchman issues on some machines.

Coverage highlights:

- `todoSlice` — CRUD and toggle behavior
- `useAuth` — success, failure, and hardware unavailable paths
- `useHome` — auth gating for add/edit/delete and delete confirmation
- `TodoItem` — render and interaction labels

## Tech Stack

- Expo SDK 56 (Bare Workflow)
- TypeScript
- Redux Toolkit + react-redux
- React Navigation (native stack)
- expo-local-authentication
- react-native-safe-area-context
- Jest + React Native Testing Library
