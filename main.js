const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const activeWin = require('active-win');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'activity-log.json');

function logActivity(data) {
    const entry = {
        time: new Date().toLocaleString(),
        ...data
    };
    try {
        fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
    } catch (error) {
        console.error('Failed to write to log file:', logFile, error);
    }
}

function startTracking() {
    let lastApp = '';

    setInterval(async () => {
        try {
            const current = await activeWin();
            // Check if current is valid and has an owner
            if (!current || !current.owner) {
                // If current is not valid, skip this iteration

                return;
            }

            const app = current.owner.name;
            const title = current.title;

            if (app !== lastApp) {
                logActivity({
                    type: 'active-window',
                    app: app,
                    title: title
                });
                lastApp = app;
            }
        } catch (error) {
            console.error('Error in activity tracking interval:', error);
        }
    }, 3000);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 250,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    startTracking();
});

ipcMain.handle('export-log', async () => {
    try {
        const { filePath, canceled } = await dialog.showSaveDialog({
            title: 'Export Activity Log',
            defaultPath: `activity-log-export-${Date.now()}.json`,
            filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (canceled || !filePath) {
            console.log('Log export canceled.');
            return { success: false, message: 'Export canceled by user.' };
        }

        fs.copyFileSync(logFile, filePath);
        console.log('Log exported successfully to:', filePath);
        return { success: true, message: `Log exported to ${filePath}` };
    } catch (error) {
        console.error('Failed to export log:', error);
        return { success: false, message: `Failed to export log: ${error.message}` };
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
