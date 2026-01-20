/**
 * Notification Helpers
 *
 * Started by Marcus (previous contractor) — Sprint 14
 * He got pulled onto the payments migration before finishing this.
 *
 * TODO: This was supposed to handle creating notifications when tasks are assigned.
 * The Activity model logs assignments already (see tasks/route.ts) but users
 * never actually SEE them. That's the gap.
 *
 * Marcus's notes before he left:
 * - "Activity log is write-only right now, nobody reads it in real-time"
 * - "I tried SSE first but hit issues with Vercel's serverless function timeout (10s max)"
 * - "Polling might be the pragmatic choice but check with the team about latency requirements"
 * - "The bell icon in header.tsx is wired up with a placeholder already"
 */

// NOTE: This was Marcus's attempt at an SSE endpoint helper.
// He abandoned it when he realized Vercel serverless functions
// can't hold long-lived connections. See docs/INCIDENTS.md for context.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationPayload {
  userId: string;
  type: "task_assigned" | "task_updated" | "comment_added";
  title: string;
  message: string;
  taskId?: string;
  link?: string;
}

/**
 * Create a notification for a user.
 *
 * TODO: Actually implement this. Right now it just logs.
 * Need to:
 * 1. Add a Notification model to Prisma schema
 * 2. Persist the notification
 * 3. Trigger real-time delivery somehow (SSE? polling? websocket?)
 *
 * See GitHub issue for the full requirements.
 */
export async function createNotification(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: NotificationPayload
): Promise<void> {
  // Marcus's placeholder — just logs for now
  console.log("[notifications] TODO: implement notification creation", _payload);
}

// Marcus tried this for SSE but it doesn't work on Vercel serverless.
// Keeping it here for reference in case someone finds a workaround.
//
// export function createSSEStream() {
//   const encoder = new TextEncoder();
//   const stream = new ReadableStream({
//     start(controller) {
//       // This gets killed after 10s on Vercel 💀
//       // Options:
//       // 1. Use Vercel's Edge Runtime (longer timeout, but different API)
//       // 2. Switch to polling
//       // 3. Use a third-party service (Pusher, Ably, etc.)
//     }
//   });
//   return stream;
// }
