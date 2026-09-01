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

`npm run dev` / `npm run build` automatically regenerate `resources/seed/` (the offline first-run fallback bundled into the packaged app) from the tracked `templates/`, `tags.json`, and `day-translations.json` at the repo root — never edit `resources/seed/` directly, it's gitignored and generated.

## Editing templates

**`templates/`, `tags.json`, and `day-translations.json` at the repo root are the source of truth**, tracked in git. Edit them here, commit, and push — every teammate's app picks up your changes automatically (see [Distributing updates to the team](#distributing-updates-to-the-team) below), no rebuild or reinstall needed.

### Template file format

Each `templates/*.md` file is one template — YAML frontmatter for the structured fields, then the message body as **plain text** below the `---`. The filename (without `.md`) becomes the template's internal id.

```markdown
---
name: Appointment Reminder
language: en
tags:
  - appointment reminder
elements:
  - name: patientName
    prompt: What is the patient's name?
    type: plaintext
  - name: apptDay
    prompt: What day of the week is the appointment?
    type: day
  - name: apptDate
    prompt: What is the appointment date?
    type: date
  - name: apptTime
    prompt: What time is the appointment?
    type: time
---
Hi {{patientName}}, this is a reminder that your appointment is scheduled for {{apptDay}}, {{apptDate}} at {{apptTime}}. Please let us know if you need to reschedule.
```

Because the body is plain text (not a JSON string), you can write it exactly like a normal message — real line breaks, paragraphs, quotation marks, apostrophes, bullet points, whatever — with no escaping. See [`templates/hst-intake-instructions.md`](templates/hst-intake-instructions.md) for a multi-paragraph example.

- `language` must be one of `en`, `es`, `zh-Hans` (Simplified Chinese), `zh-Hant` (Traditional Chinese).
- `tags` must be drawn from the list in `tags.json`.
- The body fills in each `{{elementName}}` placeholder with the matching element's answer.
- Each entry in `elements` needs a `name` (matching a placeholder), a `prompt` (the question shown to you), and a `type`:
  - `plaintext` — free text input.
  - `date` — typed input, expects `MM/DD/YYYY`.
  - `time` — three dropdowns (hour / minute / AM-PM), minutes in 15-minute steps.
  - `day` — dropdown always shown in English (Monday–Sunday); the day name is translated into the template's `language` using `day-translations.json` when the text is generated.

A malformed template file is skipped (with a warning shown in the app) rather than breaking the whole list — fix it and it reappears automatically.

### tags.json

The closed set of tags available for filtering and for templates to use:

```json
{ "tags": ["intake notes", "appointment confirmation", "appointment reminder", "HST", "In-Lab"] }
```

Add or remove entries here to change what shows up as filter chips and what templates can be tagged with.

### day-translations.json

Maps each supported language to its day names, used when a `day` element is substituted into a non-English template. To support an additional language, add a new top-level key with all seven day keys (`monday`...`sunday`), and add the language code to the `LanguageCode` union in `src/shared/types.ts` / `src/shared/schemas.ts` if it should also be selectable as a template's language.

## Distributing updates to the team

Templates are synced straight from this GitHub repo over plain HTTPS — nobody on the team needs to know git.

- **On every app launch**, TextBuilder silently checks GitHub for the latest `templates/`, `tags.json`, and `day-translations.json` from `main` and replaces the local copies if the check succeeds. If it fails (offline), whatever's already on disk is left alone.
- Anyone can also click **Sync Templates** in the app (or **File → Sync Templates**) to re-check on demand.

So the whole workflow for pushing out a template update is: edit the files under `templates/` (or `tags.json` / `day-translations.json`), commit, `git push` to `main`. The next time anyone opens the app — or hits Sync Templates — they get it. Nobody clones anything or runs a git command; the app does it via a plain tarball download from `https://codeload.github.com/ethansin/wslk-text-builder/tar.gz/refs/heads/main` (see `src/main/templateSync.ts`).

This only works because the repo is public — a private repo would need auth wired into the sync request, which isn't implemented.

Locally, all three files are also watched for changes — hand-edits made in any text editor while the app is running (e.g. while you're iterating before pushing) are picked up automatically, same as a sync.
