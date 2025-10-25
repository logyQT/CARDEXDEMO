<a id="ue4ss"></a>

# 🛠️ How to Install UE4SS for Car Dealer Simulator

[Already have it installed? Skip to installing the mod.](#savesync-mod)

### Step 1: Prepare the UE4SS Files

1.  **Unzip the UE4SS folder** you downloaded to an easily accessible spot.
2.  Inside the unzipped folder, you must find these two items:
    - The folder `ue4ss/`
    - The file `dwmapi.dll`

---

### Step 2: Find Your Game's Installation Folder

You will use Steam to locate the specific folder for **Car Dealer Simulator**:

1.  Open **Steam Library**.
2.  **Right-click** on **Car Dealer Simulator**.
3.  Go to **Properties**.
4.  Select the **Installed Files** tab.
5.  Click the **Browse...** button.

---

### Step 3: Navigate to the Correct Sub-Folder

From the main folder that opened, navigate to the specific location where the files need to go:

`CarDealerSimulator/` **>** `Binaries/` **>** `Win64/`

---

### Step 4: Final Installation

1.  Copy the two items from Step 1 (`ue4ss/` and `dwmapi.dll`).
2.  **Paste** both the folder and the file directly into the **`Win64`** folder you opened in Step 3.

**UE4SS is now installed!**

---

## 🛑 How to Temporarily Disable UE4SS

If you need to quickly stop the tool from loading without uninstalling it:

- In the **`Win64`** folder, simply **rename** the file `dwmapi.dll` to `**dwmapi.dll.bak**`.

---

## 🗑️ How to Uninstall UE4SS

To completely remove the tool:

- Go into the **`Win64`** folder and **delete** both the `ue4ss/` folder and the `dwmapi.dll` file.

<a id="savesync-mod"></a>

# 💾 How to Install the SaveSync Mod

[**_(Requires UE4SS to be already installed)_**](#ue4ss)

---

### Step 1: Prepare the SaveSync Files

1.  **Unzip the `SaveSync.zip` folder.**
2.  Locate the folder named `SaveSync/` inside the unzipped contents. This is the folder we need.

---

### Step 2: Locate the UE4SS Mods Folder

Navigate to this specific location within your game's installation:

`.../CarDealerSimulator/Binaries/Win64/ue4ss/Mods/`

---

### Step 3: Move the Mod Folder

- **Move** the `SaveSync/` folder from Step 1 directly into the **`Mods/`** folder.

---

### Step 4: Enable the Mod (Edit `mods.txt`)

1.  In the same **`Mods/`** folder, open the file named **`mods.txt`**.
2.  Add the entry `SaveSync: 1` below the "New Mods add below this line" comment.

**Your `mods.txt` should look like this:**

```
; New Mods add below this line
; -----------------------------

SaveSync: 1

; -----------------------------
; New Mods add above this line
```

**The SaveSync mod is now active!**

---

## 🛑 How to Disable and Uninstall the Mod

### To Disable

- Open **`mods.txt`** and **remove** the line `SaveSync: 1`.

### To Uninstall

1.  **Remove** the line `SaveSync: 1` from **`mods.txt`**.
2.  Go to the **`Mods/`** folder and **delete** the **`SaveSync/`** folder.
