const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'activity-log.json');

// Read the log file
fs.readFile(logFilePath, 'utf8', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // File does not exist. main.js will create it on first log.
      // If you need this script to create an empty one, use fs.writeFile(logFilePath, '', ...);
      console.log('Log file does not exist yet. It will be created upon first activity.');
      return;
    }
    console.error('❌ Error reading log file:', err);
    return;
  }

  if (data.trim() === '') {
    console.log('Log file is empty.');
    // const logs = []; // No logs to process
    // If this script is meant to add entries, it can do so here,
    // but ensure it writes in JSON Lines format.
    return;
  }

  try {
    const lines = data.trim().split('\n');
    const logs = lines.map(line => JSON.parse(line));

    console.log('Successfully parsed logs:', logs.length, 'entries found.');

    // The following part adds a new entry and rewrites the file.
    // This might not be desired if index.js is just a reader/utility.
    // If main.js is the primary logger, index.js should probably not modify the log this way.
    // For demonstration, if you wanted to add an entry from here:
    /*
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      activity: 'Some new activity from index.js'
    };
    fs.appendFile(logFilePath, JSON.stringify(newEntry) + '\n', (appendErr) => {
      if (appendErr) console.error('❌ Error appending to log file from index.js:', appendErr);
    });
    */
  } catch (parseErr) {
    console.error('❌ Error parsing JSON data from log file:', parseErr);
    // Resetting the file here might be too destructive. Consider logging the error or backing up.
  }
});
