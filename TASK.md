# Task: Real-Time Notification System

## Overview

Implement a real-time notification system for FlowBoard. Users should receive notifications when they are assigned to tasks, and these notifications should appear instantly without requiring a page refresh.

## Requirements

### Core Functionality

1. **Notification Creation**
   - When a user is assigned to a task, create a notification
   - Notifications should include: title, message, type, and link to the relevant task

2. **Real-Time Delivery**
   - Notifications should appear instantly in the UI
   - Use WebSockets or Server-Sent Events for real-time updates
   - Fallback to polling if real-time connection fails

3. **Notification Center**
   - Bell icon in the header showing unread count
   - Dropdown panel listing recent notifications
   - Mark individual notifications as read
   - "Mark all as read" functionality

4. **API Endpoints**
   - `POST /api/notifications` - Create a notification
   - `GET /api/notifications` - Fetch user notifications (paginated)
   - `PATCH /api/notifications/:id` - Mark notification as read
   - `PATCH /api/notifications/read-all` - Mark all as read

5. **Database Schema**
   - Add a `Notification` model to store notifications
   - Link notifications to users and optionally to tasks

## Acceptance Criteria

- [ ] Notification is created when a task is assigned
- [ ] Notifications appear in real-time without page refresh
- [ ] Notification bell shows accurate unread count
- [ ] Users can mark notifications as read (individually and all)
- [ ] API endpoints are properly authenticated
- [ ] Notifications are paginated (default: 20 per page)
- [ ] All existing tests still pass
- [ ] New functionality has test coverage

## Technical Notes

- The existing `Task` model has an `assigneeId` field you can use
- Consider using the existing WebSocket infrastructure if available, or add a simple SSE endpoint
- The UI should follow the existing design patterns (see `components/ui/`)
- Browser notifications are a stretch goal, not required

## Resources

- Prisma schema: `prisma/schema.prisma`
- Existing API patterns: `src/app/api/`
- UI components: `src/components/ui/`

## Questions?

If anything is unclear, feel free to ask your coworkers or manager!
