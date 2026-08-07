# Waterpark Simulator — Nucleus Co-op Handler

A [Nucleus Co-op](https://github.com/SplitScreen-Me/splitscreenme-nucleus) handler that lets you play **Waterpark Simulator** with a friend on the same PC, using two separate game instances that connect to each other locally.

No official handler existed for this game at the time of writing (it's a very new title — 1.0 with native co-op released July 31, 2026) — so I built this one myself.

## Status

✅ Tested and working: local co-op between **two** instances (Steam version), separate windows on two monitors, **both players using controllers**.

⚠️ Not tested: keyboard/mouse. I've only tested with two controllers — I haven't tried keyboard/mouse for either player, so I can't confirm it works the same way. If you try it, let me know via an issue.

⚠️ Not tested: 3 or 4 players. `Game.MaxPlayers` is set to 4 to match the game's official 2–4 player co-op cap, but I've only personally verified 2 players work — I don't have more controllers/testers to confirm beyond that. If you try 3 or 4 and it works (or doesn't), please open an issue and let me know.

⚠️ Not tested: true split-screen on a single monitor. The game has no built-in split-screen mode, so this gives you two independent windows you arrange yourself (e.g. one per monitor) rather than one screen divided in half.

## Requirements

- [Nucleus Co-op](https://github.com/SplitScreen-Me/splitscreenme-nucleus) (latest release recommended)
- Waterpark Simulator installed via Steam
- Steam AppID: `3293260`

## Installation

**Method 1 — `.nc` file (easiest)**

1. Download the latest `.nc` file from this repo's [Releases](../../releases) page.
2. Open Nucleus Co-op.
3. Click **Extract a Handler** (top toolbar) and select the downloaded `.nc` file.
4. Point it at your `WaterparkSimulator.exe` (usually under `Steam\steamapps\common\WaterPark Simulator\`).

**Method 2 — manual (if Method 1 doesn't work for you)**

1. Download the latest `.zip` from this repo's [Releases](../../releases) page.
2. Extract it directly into your Nucleus Co-op `handlers` folder, so you end up with:
   ```
   NucleusApp\handlers\WaterparkSimulator.js
   NucleusApp\handlers\WaterparkSimulator\...
   ```
3. Open Nucleus Co-op, click the **Search and add a game** icon (magnifying glass, top toolbar).
4. Point it at your `WaterparkSimulator.exe`.

**Either way, after adding the game:**

5. Assign your input devices (keyboard/mouse/controllers) to each screen section.
6. Hit Play.

## Usage notes

- **Connecting instances:** host a game on the first client, then join it from the second client the same way you'd join any other Steam lobby in-game.
- **Locking input:** once both instances are launched and connected, press **End** once to lock input — this is what makes each keyboard/mouse/controller control only its own assigned window. Before locking, input follows whichever window has Windows focus, which is expected. Press **End** again to unlock. **Ctrl+Q** closes Nucleus and all instances while input is unlocked.
- This handler uses a locally-configured [Goldberg Steam Emulator](https://github.com/Detanup01/gbe_fork) build to let instances find and connect to each other without needing multiple real Steam accounts or an actual network connection.

## Troubleshooting

If it doesn't work as expected, feel free to open an [issue](../../issues) here, or write directly to "Selsmark" on Discord.

## Credits

- Built using [Nucleus Co-op](https://github.com/SplitScreen-Me/splitscreenme-nucleus) by the SplitScreen.Me team.
- Uses [gbe_fork](https://github.com/Detanup01/gbe_fork) (Goldberg Steam Emulator, LGPL-3.0) by Detanup01, itself a fork of [Mr_Goldberg/goldberg_emulator](https://gitlab.com/Mr_Goldberg/goldberg_emulator).

## License

See [LICENSE](LICENSE).
