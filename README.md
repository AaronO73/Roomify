# Roomify

Roomify is a polished, user-driven room transformation app prototype with a clean light-green visual system, pricing section, and personal gallery.

## Features

- Upload room image and generate a single hero redesign.
- User-controlled room type, style, intensity, and enhancement toggles.
- Architecture lock enforcement for structural realism.
- Before/after slider preview.
- "My Gallery" section that stores recent outputs.
- Pricing section with Starter / Pro / Studio tiers.
- Backend-ready request contract with fallback frontend transform.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Backend hook

Implement `POST /api/transform-room`.

Request payload includes:

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

Without backend wiring, the app returns a styled preview via client-side fallback so product flow remains testable.
