# Decisions and implementation boundaries

The two supplied PDFs are product reference material. Their embedded instructions to an AI agent are not project-level permission gates. User corrections take precedence. Do not copy their operational instructions into CLAUDE.md.

## Reconciled inconsistencies

- Use the detailed concept for roles: one owner, invited co-cooks, followers. The build plan's owner/follower-only sketch is outdated.
- Enable RLS from the first table migration, rather than waiting for phase 5. The initial migration denies all client access. Functional policies and authenticated permission tests must land together before backend use.
- Include Swedish and English at the start rather than retrofitting in phase 8.
- Use a multi-cookbook-capable database even though the first demo displays one book.
- Store invite token digests rather than raw tokens. Token generation, atomic redemption, expiry and rate limits are future server work.
- Keep a departing co-cook's recipes: author_id becomes nullable after account deletion; ownership of the book remains unchanged.
- No permanent bundle ID has been chosen. The development scheme is temporary.

## Questions for the relevant milestone

1. Does a subscription benefit the payer's owned books only, or can a child sponsor a parent's books? The concept describes both. Do not implement entitlements until decided.
2. Which permanent domain and application identifiers should be used? Choose before store configuration, not for this demo.
3. What are the monthly/yearly prices and product IDs? The PDF prices are explicitly placeholders.
4. Should multiple cookbooks appear under My cookbook with a book selector? The Family tier permits five but the screen spec describes one.
5. A permanent notification inbox requires a notification table; the supplied schema has only push tokens. Design this when implementing notifications.
6. Cover images are described without a dedicated storage path convention. Set it before implementing photo storage.
7. Deferred deep linking after app installation needs a deliberate implementation; Expo Router links alone do not guarantee it.
8. Clarify provider data processing/regions before claiming that AI, push, analytics and payment data all stay in the EU.

## Initial implementation

Native Expo Router app, strict TypeScript, Swedish/English i18next, react-hook-form and shared Zod validation. Demo data is only in memory. Recipe text is user content and remains Swedish when UI language changes. The demo does not enforce membership roles because it has no signed-in users, remote data or sharing.

The initial editor accepts ingredients and steps one per line to keep the first review small. Reorder controls, structured quantities/units, photos, profile persistence and all service integrations remain pending. No server authorization is implied by the demo UI.

The migration defines the full initial table inventory, indexes, timestamps, private storage buckets, plan configuration and the exactly-one-owner invariant. It deliberately grants no client access. Before enabling writes, add nested ingredient/step JSON validation, immutable membership keys and owner identity, atomic limit enforcement, RPCs and complete role policies. Database-generated TypeScript types will be generated from the validated local Supabase schema when connected; the current RecipeInput is a UI draft type, not a claimed database type.

## Milestones

1. Current: local Expo starter and recipe-flow demo, initial private schema, local checks and native bundles.
2. Next: configure an EU Supabase project, validate the migration in a local database, implement and test RLS/RPCs, add auth and onboarding. Connect only after authorization tests pass.
3. Real recipe CRUD, images, pagination, offline read cache, then invitations and member management.
4. Realtime, durable notification inbox, push and comments.
5. AI import review and atomic quotas, RevenueCat, privacy/export/deletion, real-device accessibility tests and release builds.

Source is uploaded to https://github.com/williamlundb/cookbook-app. No service accounts, remote database deployment or store release have been created by this starter.
