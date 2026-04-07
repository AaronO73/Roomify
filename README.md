# Roomify

Roomify is a user-driven room transformation app prototype.

## What it does

- User uploads a room image.
- User chooses room type, design style, and optional enhancement toggles.
- Architecture lock is enforced to preserve windows/doors/walls/ceilings/floors/fireplaces/built-ins.
- App produces one high-impact output image and displays an optional before/after slider.

## Run locally

This prototype is static and dependency-free.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Backend hook

For production, implement:

`POST /api/transform-room`

Request body is shown in the UI (`Generation payload`) and includes:

- `image_data_url`
- `room_type`
- `style`
- `style_intensity`
- `architecture_lock`
- `enhancements[]`
- `hard_constraints[]`

Expected response:

```json
{
  "transformed_image_data_url": "data:image/jpeg;base64,..."
}
```

If no backend is present, the app uses a frontend fallback transform so users can still test the product flow end-to-end.
