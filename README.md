# TextBuilder

A lightweight local text-template compiler. Pick a template, answer a short form, get the filled text with one click to copy to the clipboard.

## Development

```bash
npm install
npm run dev
```

To test first-run behavior repeatedly without touching your real `~/Documents/TextBuilder` folder, set `TEXTBUILDER_HOME` to a scratch directory before launching:

```bash
TEXTBUILDER_HOME=/tmp/textbuilder-test npm run dev
```

## Building

```bash
npm run build:mac    # macOS (dmg + zip)
npm run build:win    # Windows (nsis + portable) — run on Windows or via CI, not from macOS
```

Windows builds should be produced on a Windows machine or via the GitHub Actions workflow in `.github/workflows/build.yml` — building the NSIS installer from macOS requires Wine and is unreliable.

## Adding / editing templates

Your templates live in `~/Documents/TextBuilder/`:

```
TextBuilder/
├── templates/
│   ├── appointment-reminder.json
│   └── ...
├── tags.json
└── day-translations.json
```

Open this folder anytime from the app's **Open Templates Folder** button, or the **File** menu.

### Template file format

Each `templates/*.json` file is one template. The filename (without `.json`) becomes its internal id — rename the file to rename the template's id.

```json
{
  "name": "Appointment Reminder",
  "language": "en",
  "tags": ["appointment", "reminder"],
  "body": "Hi {{patientName}}, your appointment is {{apptDay}}, {{apptDate}} at {{apptTime}}.",
  "elements": [
    { "name": "patientName", "prompt": "What is the patient's name?", "type": "plaintext" },
    { "name": "apptDay", "prompt": "What day is the appointment?", "type": "day" },
    { "name": "apptDate", "prompt": "What is the appointment date?", "type": "date" },
    { "name": "apptTime", "prompt": "What time is the appointment?", "type": "time" }
  ]
}
```

- `language` must be one of `"en"`, `"es"`, `"zh-Hans"` (Simplified Chinese), `"zh-Hant"` (Traditional Chinese).
- `tags` must be drawn from the list in `tags.json`.
- `body` fills in each `{{elementName}}` placeholder with the matching element's answer.
- Each entry in `elements` needs a `name` (matching a placeholder), a `prompt` (the question shown to you), and a `type`:
  - `"plaintext"` — free text input.
  - `"date"` — typed input, expects `MM/DD/YYYY`.
  - `"time"` — dropdown, `HH:MM AM/PM` in 15-minute steps.
  - `"day"` — dropdown always shown in English (Monday–Sunday); the day name is translated into the template's `language` using `day-translations.json` when the text is generated.

A malformed template file is skipped (with a warning shown in the app) rather than breaking the whole list — fix the JSON and it reappears automatically.

### tags.json

The closed set of tags available for filtering and for templates to use:

```json
{ "tags": ["appointment", "discharge", "reminder", "follow-up", "general"] }
```

Add or remove entries here to change what shows up as filter chips and what templates can be tagged with.

### day-translations.json

Maps each supported language to its day names, used when a `"day"` element is substituted into a non-English template:

```json
{
  "en": { "monday": "Monday", "tuesday": "Tuesday", "...": "..." },
  "es": { "monday": "lunes", "tuesday": "martes", "...": "..." }
}
```

To support an additional language, add a new top-level key here with all seven day keys (`monday`...`sunday`), and add the language code to the `language` enum in `src/shared/types.ts` / `src/shared/schemas.ts` if it should also be selectable as a template's language.

All three files are watched for changes — edits made in any text editor while the app is running are picked up automatically.
