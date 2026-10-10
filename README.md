# Build Session 02: a notes server

A small notes web server built step by step with real commands. Node.js only, no npm packages, no dependencies.

- `POST /notes` with `{"text":"..."}` adds a note (400 if the text is missing)
- `GET /notes` lists notes
- `DELETE /notes/ID` removes a note (404 if it does not exist)
- Notes are saved to `notes.json` and survive restarts

## Run it

Built and tested on Node.js v22.23.3 (other versions are untested).

    npm test          # 5 automated tests
    node server.js    # listens on http://127.0.0.1:3000 (set PORT to change)

The server only listens on 127.0.0.1, your own computer.

## The interactive walkthrough

The commands that build this project, with the real output recorded from a real run, are in the companion practice page: https://faiz12321.github.io/ai-tools-that-work/build-session-02-notes-server.html . Nothing in it runs on your device.

## Notes

- Educational example, no warranty. Use at your own risk.
- Sample notes in the walkthrough are made-up text.
- Code is MIT licensed (see LICENSE). Node.js and curl are separate projects with their own licenses; this repository does not include them.
- Practice only: the server has no login and no request size limit, so do not expose it to the internet. If `notes.json` is damaged the server will not start.
- The commands are for a macOS or Linux terminal (on Windows, use WSL).
