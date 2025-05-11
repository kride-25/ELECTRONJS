# ELECTRONJS
ACTIVITY TRACKER
# Activity Tracker README

This document provides an overview of the Activity Tracker application, its file structure, and the purpose of its key components and scripts.

## Project Overview

Activity Tracker is an Electron application designed to monitor and log user activities such as mouse clicks, key presses, scrolling, and active window changes. The logged data is stored in a JSON file (`c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json`) and can be exported.

## File Structure and Key Files

Below is an explanation of the important files in this project and their roles.

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\package.json`

This is the main configuration file for the Node.js project, defining metadata, scripts, and dependencies.

*   **`name`**: `activity-tracker`
    *   The official name of the package.
*   **`version`**: `1.0.0`
    *   The current version of the application.
*   **`description`**: (empty in the provided file)
    *   A brief description of what the project does.
*   **`main`**: `main.js`
    *   **Function**: This is the entry point for the Electron main process. The `main.js` file is responsible for creating browser windows, handling system events, and managing all backend logic of the application.
*   **`scripts`**:
    *   `"start": "electron ."`
        *   **Purpose**: To run the application in a development environment.
        *   **Function**: This script executes the Electron binary, telling it to start the application defined in the current directory (`.`). Electron will look for the `main` script specified in `package.json` (i.e., `main.js`) to launch the app.
    *   `"package": "electron-packager . activity-tracker --platform=win32 --arch=x64 --overwrite --out=dist"`
        *   **Purpose**: To package the application into a distributable format for 64-bit Windows.
        *   **Function**: This script uses the `electron-packager` tool to bundle the application.
            *   `.`: Specifies the source directory of the application (current directory).
            *   `activity-tracker`: The name of the application.
            *   `--platform=win32`: Targets the Windows platform.
            *   `--arch=x64`: Specifies a 64-bit architecture.
            *   `--overwrite`: Allows overwriting of a previous package if it exists.
            *   `--out=dist`: Specifies the output directory (`c:\Users\kride\OneDrive\Desktop\activity-tracker\dist\`) for the packaged application.
*   **`keywords`**: (empty in the provided file)
    *   Keywords that would help in discovering the package if it were published (e.g., on npm).
*   **`author`**: (empty in the provided file)
    *   The name of the project's author.
*   **`license`**: `ISC`
    *   The software license under which the project is distributed.
*   **`type`**: `commonjs`
    *   **Function**: Specifies the module system being used. `commonjs` is the traditional Node.js module system (using `require` and `module.exports`).
*   **`dependencies`**:
    *   `"active-win": "^8.2.1"`
        *   **Purpose**: A library to get metadata about the currently active window on the user's system (e.g., application name, window title).
        *   **Likely Usage**: Functions within `main.js` would use this dependency to periodically check and log information about the active window, which is then saved into `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json`.
*   **`devDependencies`**:
    *   `"electron": "^36.2.0"`
        *   **Purpose**: The Electron framework itself, essential for building and running the application.
    *   `"electron-packager": "^17.1.2"`
        *   **Purpose**: The tool used by the `package` script to create distributable versions of the Electron application.

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\main.js` (Expected Content)

This file is the entry point for the Electron main process. While its specific content isn't provided, it typically contains functions to:

*   **Manage Application Lifecycle**:
    *   Functions to handle Electron `app` module events such as `ready` (to create the main window when the app is initialized), `window-all-closed` (to quit the app when all windows are closed, except on macOS), and `activate` (to re-create a window on macOS when the dock icon is clicked and no other windows are open).
*   **Create and Manage Windows**:
    *   `createWindow()`: A core function that instantiates `BrowserWindow`, loads `index.html` into it, and sets window properties (size, frame, etc.).
*   **Activity Tracking Logic**:
    *   `startActivityListeners()`: Functions to set up global listeners for user input, such as mouse clicks (e.g., using `globalShortcut` or `iohook` - though `iohook` is not listed as a direct dependency, `active-win` handles window info), key presses, and scroll events.
    *   `logActivity(type, details)`: A function that takes the type of activity and its details, creates a timestamped log entry, and appends it to the `activity-log.json` file. This would involve file system operations (e.g., using Node.js `fs` module).
    *   `logActiveWindow()`: A function that periodically calls `active-win` to get the current active window's title and application, then logs this information.
*   **Inter-Process Communication (IPC)**:
    *   Setup of `ipcMain` listeners (e.g., `ipcMain.on('export-log', ...)` or `ipcMain.handle('get-log-data', ...)` to handle requests from the renderer process (UI).
    *   Functions to send data to the renderer process (e.g., `mainWindow.webContents.send('log-updated', newEntry)`) when new activities are logged.
*   **File System Operations**:
    *   `readLogFile()`: To read existing logs from `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json` for display or export.
    *   `appendLogEntry(entry)`: To add new entries to `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json`.
    *   `exportLogData()`: A function that reads the current log and writes it to a new timestamped file (e.g., `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log-export-TIMESTAMP.json`).

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\index.html` (Expected Entry for Renderer Process)

This HTML file is loaded by `main.js` into the application's main window. It defines the user interface.

*   **Structure**: Contains the HTML layout for displaying the activity log and any control buttons (e.g., "Export Log").
*   **Scripts**: It would link to or embed JavaScript files (e.g., `renderer.js`) that manage the UI and communication with the main process. The `package.json` inside the `dist` folder (`c:\Users\kride\OneDrive\Desktop\activity-tracker\dist\activity-tracker-win32-x64\resources\app\package.json`) lists `index.html` as its `main`, which is typical for the packaged app's renderer entry.

### Renderer Process JavaScript (e.g., `renderer.js`) (Expected Content)

This JavaScript code runs in the renderer process (the browser window) and is responsible for:

*   **Displaying Data**:
    *   Functions to fetch or receive log data from the main process via IPC.
    *   Functions to dynamically update the HTML to display log entries (e.g., creating list items or table rows for each activity).
*   **Handling User Interactions**:
    *   Event listeners for UI elements. For example, an "Export Log" button would trigger an IPC message to the main process to perform the export.
*   **Inter-Process Communication (IPC)**:
    *   Using `ipcRenderer.send()` or `ipcRenderer.invoke()` to send messages/requests to `main.js`.
    *   Using `ipcRenderer.on()` to listen for messages/updates from `main.js` (e.g., to refresh the displayed log).

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json`

This file acts as the primary data store for all logged activities.

*   **Format**: A JSON array of objects.
*   **Entry Structure**: Each object in the array represents a single logged event and typically contains:
    *   `"timestamp"`: A string indicating when the activity occurred (e.g., `"11/5/2025, 8:38:02 pm"`).
    *   `"activity"`: A string describing the logged activity. Examples include:
        *   `"Mouse Click at (224, 173)"`
        *   `"Key Pressed: h"`
        *   `"Scrolled"`
        *   The file also shows appended JSON objects for active window tracking like `{"time":"11/5/2025, 9:10:51 pm","type":"active-window","app":"Electron","title":"Activity Tracker"}`. Ideally, these would be integrated into the main JSON array if they are part of the same log stream.
*   **Functions Interacting with it (in `main.js`)**:
    *   Reading the file on application start (potentially).
    *   Appending new log entries as activities are detected.
    *   Reading the file when an export is requested.

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log-export-TIMESTAMP.json` (e.g., `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log-export-1746978134719.json`)

These files are generated when the user chooses to export the activity log.

*   **Purpose**: To create a snapshot of the `activity-log.json` content at a specific point in time, allowing the user to save or analyze the data externally.
*   **Content**: Contains a copy of the array of log entries from `c:\Users\kride\OneDrive\Desktop\activity-tracker\activity-log.json`.
*   **Naming Convention**: The filename includes a timestamp (e.g., `1746978134719`) to ensure each export is unique.

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\package-lock.json`

This file is automatically generated by `npm`.

*   **Purpose**: It records the exact, specific versions of all direct and indirect dependencies used by the project. This ensures that installations are repeatable and consistent across different environments or collaborators.
*   **Functions**: It does not contain application-specific functions but is vital for the build and dependency resolution process.

### `c:\Users\kride\OneDrive\Desktop\activity-tracker\dist\activity-tracker-win32-x64\`

This directory is the output location for the packaged Windows application, generated by the `npm run package` script.

*   **`resources\app\package.json`**: A `package.json` file tailored for the packaged application. Notably, its `"main"` field is `index.html`, indicating the entry point for the renderer process within the packaged app.
*   **`resources\app\activity-log.json`**: This is a copy of the `activity-log.json` that was present at the time of packaging. The actual running application might store its live `activity-log.json` in a user-specific data directory (e.g., AppData on Windows) rather than modifying this bundled version.

## How to Use

### Development

1.  **Clone the repository** (if applicable).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the application**:
    ```bash
    npm start
    ```

### Packaging

1.  **Package the application for Windows (x64)**:
    ```bash
    npm run package
    ```
2.  The packaged application will be located in the `c:\Users\kride\OneDrive\Desktop\activity-tracker\dist\activity-tracker-win32-x64` directory.

---

**Note**: This README provides a general overview based on the `package.json` and common Electron application patterns. For a precise description of every function within `main.js` and any renderer-side JavaScript files, their source code would need to be reviewed.
