# Incident Log

## INC-042: Task Assignments Going Unnoticed

**Date:** 2026-01-08
**Severity:** Medium
**Status:** Open — workaround in place
**Reported by:** Sarah Kim (Product)

### What Happened

Multiple users reported that they were being assigned tasks but had no idea until someone mentioned it in standup (sometimes days later). Two PMs escalated this because sprint velocity was being impacted — tasks sat in "To Do" for 2-3 days before assignees even noticed.

### Impact

- ~15% of task assignments were "missed" (not acted on within 24 hours)
- 2 client-facing deadlines slipped because assignees didn't start work on time
- Product team had to resort to manually pinging people on Slack

### Root Cause

FlowBoard logs task assignments to the Activity feed (`/api/activity`), but:
1. The activity feed is only visible on the project page — users don't check it proactively
2. There's no push notification, email, or real-time alert when you're assigned a task
3. The bell icon in the header is non-functional (placeholder from initial build)

Basically, the assignment happens server-side and the only evidence is a database record that nobody looks at.

### Previous Attempt

Marcus (contractor) started building a notification system in Sprint 14. He got the stub code into `src/lib/notifications.ts` and was working on SSE delivery. He ran into issues:

- **Vercel serverless timeout**: SSE connections were getting killed after 10 seconds because Vercel's Node.js runtime has a max execution time on the Hobby plan
- He was exploring Edge Runtime as a workaround but got pulled onto the payments migration before finishing

His notes suggest polling as a pragmatic fallback, but the team hasn't decided on the approach yet.

### Current Workaround

Product team manually Slack-messages people when they assign them tasks. This is not sustainable.

### What Needs to Happen

See GitHub Issue #7 for the full requirements. Key decisions still needed:
- Real-time delivery approach (SSE on Edge Runtime? polling? third-party?)
- Whether to batch notifications or send immediately
- Unread count behavior (per-project or global?)

### Related

- `src/lib/notifications.ts` — Marcus's stub code
- `src/components/header.tsx` — Bell icon placeholder (line 44-48)
- `src/app/api/tasks/route.ts` — Where assignments are created (line 104-114)
- `src/app/api/tasks/[id]/route.ts` — Where assignments change on update (line 94-110)
