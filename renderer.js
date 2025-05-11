const { ipcRenderer } = require('electron');

// This function updates the UI with the latest log entry
// It creates a new list item and appends it to the activity log
// It uses the current date and time to timestamp the log entry
// The log entry is passed as a parameter to the function
function updateLogDisplay(data) {
  const logElement = document.getElementById('activity-log');
  const listItem = document.createElement('li');
  listItem.textContent = `[${new Date().toLocaleString()}] ${data}`;
  logElement.appendChild(listItem);
}

// This function sends a message to the main process to log the activity
// It uses the ipcRenderer module to send the message   
function logEvent(data) {
  ipcRenderer.send('log-activity', data);
  updateLogDisplay(data);  // Update the UI with the new log entry  

}

// It is the Event listeners for various user activities
document.addEventListener('click', (e) => {
  logEvent(`Mouse Click at (${e.clientX}, ${e.clientY})`);
});

document.addEventListener('keydown', (e) => {
  logEvent(`Key Pressed: ${e.key}`);
});

document.addEventListener('scroll', () => {
  logEvent(`Scrolled`);
});

// This function is called when the user clicks the "Export Log" button
// It sends a message to the main process to export the log

document.getElementById('exportBtn').addEventListener('click', () => {
  ipcRenderer.invoke('export-log');
});
