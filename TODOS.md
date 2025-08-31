## In Progress

- [x] Plan migration for `updatedAt` on `workouts`
- [x] Phase 1: Add optional `updatedAt` to schema
- [x] Phase 1: Set `updatedAt` on create/update mutations
- [x] Phase 1: UI fallback to `updatedAt` with `_creationTime` as backup
- [x] Phase 1: Create internal backfill mutation (`updatedAt` = `_creationTime`)
- [ ] Phase 1: Deploy to production (Owner action)
- [ ] Phase 1: Run backfill in production (Owner action)
- [ ] Phase 1: Verify UI sync time old/new workouts (Owner action)

## Upcoming

- [ ] Phase 2: Make `updatedAt` required in schema
- [ ] Phase 2: Remove UI fallback and rely on `updatedAt`
- [ ] Phase 2: Deploy to production (Owner action)

Notes:

- Deployments and backfill execution will be performed by the owner.
