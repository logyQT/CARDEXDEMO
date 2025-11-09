# [CDS CarDex Demo](https://logyqt.github.io/CARDEXDEMO/)

This demo project highlights a single game mechanic, offering a quick example to spark ideas and inspire creativity.

> **Note:**  
> Created for fun and programming practice, this project is not intended for ongoing updates or maintenance.

---

**Disclaimer:**  
This project is an independent creation and is not affiliated with, endorsed by, or associated with the developers or publishers of Car Dealer Simulator. All trademarks and copyrights belong to their respective owners.

## How to Use

- Earn trophies by uploading a `.hrs` save file from `%localappdata%/CarDealerSimulator/Saved`.
- Slot a trophy by clicking any empty slot.
- Progress is saved instantly and stored in your browser’s local storage.
- You can share your progress via link with the SHARE button.

## Potential Features

Possible future enhancements include:

- **Rewards:** Unlock cosmetic upgrades or new gameplay features as you progress.
- ~~**Search:** Locate specific cars quickly using a search bar.~~ Has been implemented in 2.0.2 release.
- ~~**Sorting:** Arrange the trophy index by name, type, or other criteria.~~ Has been implemented as of 2.0.9.
- ~~**Filtering:** Display only missing or owned cars to easily track your collection.~~ Implemented by the search bar - you can search for missing / owned cars as of 2.0.2 release.

## Limitations

This demo is not highly flexible or responsive. It may not display correctly on smaller screens or devices. For the best experience, use a desktop browser.

## Acknowledgments

Special thanks to **.faulty.** for providing mapping data and game assets.

Thanks also to **duckobread**, the community manager, for approving the release of this project on GitHub.

## Changelog

### 2.0.1

- Added the **Phantom ThunderX** trophy.
- Fixed issues with importing JSON files.
- Improved trophy retrieval from save files by checking the player inventory.
- Introduced an **Autofill** button to quickly fill all trophy slots.

### 2.0.2

- Now detects trophies left in the game world.
- Added a search bar.
- You can now swap out collected trophies.
- You can now share your collection via a link.
- ~~**KNOWN BUG** - cannot slot or change trophies when in search mode.~~ **FIXED** in 2.0.4

### 2.0.3

- Changed how some interaction work, regarding sharing the CarDex.
- Fixed some issues regarding sharing collections.

### 2.0.4

- Fixed an issue where trophies couldn’t be slotted while in search mode, even though no UI errors were displayed.

### 2.0.5

- Added the **Aurora Outrider** trophy.
- Removed the Random Trophy button, which was originally intended for debugging.

### 2.0.6

- Added full image preloading for a smoother experience, especially on slower connections.
- Optimized assets for the web - all images now use the modern WebP format, reducing file size and network usage by up to 5×.

### 2.0.7

- Implemented the AutoUpdate feature. The mod, that allows it work will be released on Nexus as to comply with Car Dealer Simulator’s official guidelines. Unfortunately, direct publication here is not permitted under current policy.
- Autofill no longer overwrites your displayed trophies. It will only fill empty slots.
- Added the **UMX 800C** trophy.

### 2.0.8

- Added a numeric indicator showing how many trophies match a slot.
- Refactor: Improved AutoUpdate logic to cover all Actor use cases.
- Improved AutoUpdate to reuse last selected location.

### 2.0.9

- Implemented sorting functionality

### 2.1.0

- Enhanced the overall UI aesthetic
- Introduced powerful new filtering and a dedicated, combined sort/filter modal.
- Temporiarly disabled JSON save data export/import.

### 2.1.1

- Added the **UMX 700R** trophy.
- Reworked how the share links work.
