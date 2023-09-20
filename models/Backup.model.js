const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { uploadBackupFolder } = require('./Update.model')

const backup = async () => {
    try {
        const backupDir = path.join(__dirname, '../backups'); // Use path.join for cross-platform compatibility

        // Create a backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        // Execute the mongodump command to backup the MongoDB database
        await exec(`mongodump --db truyenvui --out ${backupDir}`, {
            shell: '/bin/bash'
        });

        await uploadBackupFolder();
        console.log('Backup completed successfully.');

    } catch (error) {
        console.error(`Backup process failed: ${error.message}`);
    }
};

// Schedule the backup function to run daily at midnight (00:00)
//cron.schedule('0 0 * * *', backup); // This schedules the backup function to run daily at midnight

// Optionally, you can also run the backup function immediately on startup
backup();
