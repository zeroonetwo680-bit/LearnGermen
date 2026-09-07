# Backend Handoff

This project is built with a mock-first API architecture.

## Current mode
- `NEXT_PUBLIC_API_MODE=mock`
- Data is served from local JSON fixtures through a mock transport.
- UI components never import raw fixtures directly.

## Future mode
When a real backend exists, switch to:

```dotenv
NEXT_PUBLIC_API_MODE=http
NEXT_PUBLIC_API_BASE_PATH=/api
API_INTERNAL_URL=http://your-backend
```

The UI should keep working without rewriting pages or components because it already talks to:
- typed endpoint factories
- validated API clients
- transport adapters

## Current layers
- contracts → DTO definitions
- schemas → Zod validation
- transport → mock or fetch
- modules → typed endpoint operations
- hooks/server helpers → UI entry points

## Persistence today vs later
- Today: localStorage progress repository
- Later: remote progress repository backed by real user storage
