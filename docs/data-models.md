# Data Models

## User (`auth.users`)
Managed by Supabase Auth.
- `id` (UUID, PK)
- `email` (String)
- `created_at` (Timestamp)

## Public User Profile (`public.users`)
Mirrors auth users for public/shared access.
- `id` (UUID, PK, FK -> `auth.users.id`)
- `username` (Text)
- `avatar_url` (Text)
- `email` (Text): Duplicated from auth.users for visibility in lobby.

## Game Session (`public.game_sessions`)
Represents a single match.
- `id` (UUID, PK): `gen_random_uuid()`
- `code` (Text, Unique): Human-readable join code (e.g., "ABCD")
- `host_id` (UUID, FK -> `auth.users.id`): The creator of the game
- `status` (Enum): `waiting`, `active`, `finished`
- `difficulty` (Enum): `easy`, `medium`, `hard`
- `created_at` (Timestamptz)
- `winner_id` (UUID, Nullable): FK -> `auth.users.id`

## Player (`public.players`)
Links a user to a game session.
- `id` (UUID, PK): `gen_random_uuid()`
- `game_id` (UUID, FK -> `game_sessions.id`)
- `user_id` (UUID, FK -> `auth.users.id`)
- `character_id` (Integer, Nullable): ID of the assigned character (Secret)
- `is_ready` (Boolean): Default `false`

## Move (`public.moves`)
Records actions taken during the game.
- `id` (UUID, PK)
- `game_id` (UUID, FK)
- `player_id` (UUID, FK)
- `action_type` (Enum): `question`, `guess`, `flip`
- `details` (JSONB): Stores dynamic data like "Question text" or "flipped card IDs"
- `created_at` (Timestamptz)

## Relationship Diagram (ERD)

```mermaid
erDiagram
    auth_users ||--o{ game_sessions : hosts
    auth_users ||--o{ players : "plays as"
    game_sessions ||--o{ players : contains
    game_sessions ||--o{ moves : tracks
    players ||--o{ moves : performs
```
