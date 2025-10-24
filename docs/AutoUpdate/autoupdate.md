# [SaveSync](link_to_nexus)

## Overview

**SaveSync** is a lightweight utility mod that exports the game’s current runtime and persistent state data into a structured JSON file (`export.json`).

It enables external applications, such as websites, dashboards, or companion apps, to parse game data for live updates (ex. trophy progress, player stats, or session metrics).

---

## File Output

- **File:** `export.json`
- **Path:** `<mod_dir>/exports/export.json` _(configurable)_
- **Format:** Standard JSON (UTF-8)

---

## Update Triggers

- On autosave
- On manual save
- Potentialy on a set interval in the future

---

## [JSON Schema](./index.html)

### _below is a simplified example of exposed data_

```json
{
  "_timestamp": "number",
  "additional_systems": {
    "AdditionalGameData": {},
    "Economy": {},
    "EventHandler": {},
    "Inventory": {},
    "PlayerPawn": {},
    "PlayerStorage": {},
    "SideEventsManager": {},
    "UpgradeSystem": {},
    "VehicleSystem": {}
  },
  "runtime_objects": []
}
```

---

## Usage

- It is recommended to walk the whole object and parse any json before reading any data, as the dump consists of a lot of serialized json.
  - _example javascript code:_

```js
/**
 * Recursively walks through an object and parses any JSON strings.
 * @param {*} obj - The object to walk through.
 * @returns {*} - The parsed object.
 */

const walkObjectParseJson = (obj) => {
  if (obj == null) return obj;

  if (typeof obj === "string") {
    if (obj.length && (obj[0] === "{" || obj[0] === "[")) {
      try {
        const parsed = JSON.parse(obj);
        return walkObjectParseJson(parsed);
      } catch {
        return obj;
      }
    }
    return obj;
  }

  if (typeof obj !== "object") return obj;

  const keys = Array.isArray(obj) ? obj.keys() : Object.keys(obj);
  for (const key of keys) {
    obj[key] = walkObjectParseJson(obj[key]);
  }

  return obj;
};
export { walkObjectParseJson };
```

---
