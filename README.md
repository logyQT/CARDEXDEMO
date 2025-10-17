# [CDS CarDex Demo](https://logyqt.github.io/CARDEXDEMO/)

This demo project highlights a single game mechanic, offering a quick example to spark ideas and inspire creativity.

> **Note:**  
> Created for fun and programming practice, this project is not intended for ongoing updates or maintenance.

---

**Disclaimer:**  
This project is an independent creation and is not affiliated with, endorsed by, or associated with the developers or publishers of Car Dealer Simulator. All trademarks and copyrights belong to their respective owners.

## How to Use

- Earn trophies by clicking the **Random Trophy** button or uploading a `.hrs` save file from `%localappdata%/CarDealerSimulator/Saved`.
- Slot a trophy by clicking any empty slot.
- Progress is saved instantly and stored in your browser’s local storage.

## Potential Features

Possible future enhancements include:

- **Rewards:** Unlock cosmetic upgrades or new gameplay features as you progress.
- ~~**Search:** Locate specific cars quickly using a search bar.~~ Has been implemented in 2.0.2 release.
- **Sorting:** Arrange the trophy index by name, type, or other criteria.
- ~~**Filtering:** Display only missing or owned cars to easily track your collection.~~ Implemented by the search bar - you can search for missing / owned cars as of 2.0.2 release.

Even if no further features are added, this demo serves as a reference for anyone interested in similar mechanics.

Some features are currently missing and may be added in the future, depending on interest and available time. The current version focuses on one core mechanic, with room for expansion.

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
- **KNOWN BUG** - cannot slot or change trophies when in search mode.

### 2.0.3

- Changed how some interaction work, regarding sharing the CarDex.
- Fixed some issues regarding sharing collections.

### 2.0.4

- Fixed an issue where trophies couldn’t be slotted while in search mode, even though no UI errors were displayed.

### 2.0.5

- Added the **Aurora Outrider** trophy.
- Removed the Random Trophy Button.
