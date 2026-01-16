# FlowBoard API Documentation

This document describes the REST API endpoints available in FlowBoard.

## Base URL

All API endpoints are relative to `/api`.

## Authentication

Currently, authentication is not implemented. The TODO comments in the code indicate where user session handling should be added.

## Endpoints

### Projects

#### List Projects

```
GET /api/projects
```

Query parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status ("active", "archived", "completed")

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "status": "string",
      "dueDate": "string | null",
      "owner": {
        "id": "string",
        "name": "string",
        "avatarUrl": "string | null"
      },
      "_count": {
        "tasks": "number",
        "members": "number"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### Create Project

```
POST /api/projects
```

Request body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "dueDate": "ISO 8601 date string (optional)"
}
```

#### Get Project

```
GET /api/projects/:id
```

#### Update Project

```
PATCH /api/projects/:id
```

Request body (all fields optional):
```json
{
  "name": "string",
  "description": "string",
  "status": "string",
  "dueDate": "string"
}
```

#### Delete Project

```
DELETE /api/projects/:id
```

### Tasks

#### List Tasks

```
GET /api/tasks
```

Query parameters:
- `projectId` (optional): Filter by project
- `status` (optional): Filter by status
- `assigneeId` (optional): Filter by assignee
- `page` (optional): Page number
- `limit` (optional): Items per page

#### Create Task

```
POST /api/tasks
```

Request body:
```json
{
  "projectId": "string (required)",
  "title": "string (required)",
  "description": "string (optional)",
  "status": "todo | in_progress | review | done (default: todo)",
  "priority": "low | medium | high | urgent (default: medium)",
  "dueDate": "ISO 8601 date string (optional)",
  "assigneeId": "string | null (optional)"
}
```

#### Get Task

```
GET /api/tasks/:id
```

#### Update Task

```
PATCH /api/tasks/:id
```

Request body (all fields optional):
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assigneeId": "string | null"
}
```

#### Delete Task

```
DELETE /api/tasks/:id
```

### Comments

#### List Comments

```
GET /api/comments?taskId=:taskId
```

Returns threaded comments for a task.

#### Create Comment

```
POST /api/comments
```

Request body:
```json
{
  "taskId": "string (required)",
  "content": "string (required)",
  "parentId": "string | null (optional, for replies)"
}
```

### Users

#### List Users

```
GET /api/users
```

Query parameters:
- `search` (optional): Search by name or email
- `limit` (optional): Max results (default: 50)

### Activity

#### List Activity

```
GET /api/activity
```

Query parameters:
- `projectId` (optional): Filter by project
- `taskId` (optional): Filter by task
- `userId` (optional): Filter by user
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 20)

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

HTTP status codes:
- `400` - Bad request (validation error)
- `404` - Resource not found
- `500` - Internal server error

## Validation

Request bodies are validated using Zod schemas defined in `src/lib/validations.ts`.
