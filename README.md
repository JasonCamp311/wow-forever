# Forever Field Guide

A fan-made setup guide for World of Warcraft: Forever: hidden graphics commands, built-in tools worth turning on, and the addons that work.

Live at https://jasoncamp311.github.io/wow-forever/

- `index.html`, `style.css`, `app.js`: the setup page. No build step.
- `classes.html`, `leveling.html`, `pages.css`, `pages.js`: class guides and the 1–20 leveling guide for every race and class.
- `guide-data.js`: all class, race, route and addon data both pages render from. Extend a route past 20 by adding steps to `routes` and a bracket to `BRACKETS` in `pages.js`.
- `tools/install_addons.py`: installs or updates the guide's addon set from CurseForge (game closed):

  ```
  python -I tools/install_addons.py "C:/Program Files (x86)/World of Warcraft/_forever_/Interface/AddOns"
  ```

Unofficial. Not affiliated with or endorsed by Blizzard Entertainment.
