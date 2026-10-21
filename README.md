# Family Cookbook

An initial native iOS/Android demo based on the supplied concept and build plan. This is the beginning of the app, not a production release.

## Try it

From this folder on this Windows computer:

```powershell
.\Start-App.ps1
```

The helper uses installed Node/pnpm or the Codex bundled runtime. It installs dependencies if missing and displays Expo's terminal QR code. Keep the terminal running. On a compatible Expo Go installation, scan it with your phone on the same network (Camera on iOS, Expo Go on Android).

This starter uses Expo SDK 57, which Expo Go in the stores supports during the SDK 58 rollout. Expo announced Expo Go for SDK 58 is still rolling out. Expo's documentation currently gives conflicting iOS install advice: its September 3 changelog says the App Store build supports SDK 57, while its version-mismatch troubleshooting page says physical iPhones on SDK 54 and later need Expo Go built with EAS and installed through TestFlight. If the same mismatch persists on iPhone, Expo's supported path is an EAS Go build distributed through TestFlight; on Android use Expo Go for SDK 57. Android and iPhone cannot install each other's Expo Go builds.

On a normal Node 24+ setup with pnpm 11 installed:

```sh
pnpm install --frozen-lockfile
pnpm start
```

## Implemented in the demo

- Four tabs: My cookbook, Following, Notifications, Profile.
- Swedish by default unless the device language is English; language switching in Profile.
- Three sample recipes; category filtering and title/ingredient search.
- Add, edit and delete sample recipes. Only a title is required. Numbers and text limits are validated with Zod through react-hook-form.
- Recipe details with ingredients, times, method and tips.
- Large-text cooking mode with next/previous steps and screen kept awake.
- Unsaved-edit confirmation, accessibility labels and large buttons.

Demo changes and language preference reset when the app restarts. Recipes are sample user content and remain Swedish when the UI language changes. Temporary in-memory editing is for review; production offline creation is not in scope.

## Backend foundation

The migration in supabase/migrations defines profiles, books, memberships including co-cooks, recipes, comments, hashed invites, push tokens, AI usage, plan limits and private storage buckets.

RLS is enabled and client privileges are revoked. The migration is a draft that has not been executed against Supabase. No functional client policies, auth connection, secrets or remote deployment are included. Do not connect production data until migrations and forbidden-action integration tests pass in local Supabase. The database intentionally denies all app requests in its current state.

Sign-in, sharing, live updates, comments, photos, AI import, purchases, durable offline reading, data export and account deletion remain future milestones. Following and Notifications explain their pending state.

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm exec expo export --platform all --output-dir ../../work/native-export
```

Four tests cover recipe validation, numeric/category/text constraints, ingredient search with filters, and translation key parity. CI runs typecheck, lint and tests on pushes and pull requests.

These are development checks. Physical iOS/Android behavior, screen-reader behavior, large-text layout and database security still need device and database testing.

## Next

See docs/DECISIONS.md for reconciled document mistakes, open product questions and milestones. Next: phone review, then Supabase auth plus tested role policies. Source repository: https://github.com/williamlundb/cookbook-app.
