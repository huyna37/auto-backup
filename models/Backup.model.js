const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { uploadBackupFolder } = require('./Update.model');
const cron = require('node-cron');

const backup = async () => {
    try {
        const backupDir = path.join(__dirname, '../'); // Use path.join for cross-platform compatibility

        // Create a backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        // Execute the mongodump command to backup the MongoDB database
        exec(`mongodump --uri=mongodb://103.252.137.158:27018/truyenvui --out ${backupDir}`).on('exit', (code, signal) => {
            if (code === 0) {
                // Backup was successful, you can now proceed with the upload
                uploadBackupFolder()
                    .then(() => {
                        console.log('Backup completed successfully.');
                    })
                    .catch((uploadError) => {
                        console.error(`Upload failed: ${uploadError.message}`);
                    });
            } else {
                console.error(`mongodump process exited with code ${code} and signal ${signal}`);
            }
        });

    } catch (error) {
        console.error(`Backup process failed: ${error.message}`);
    }
};

// Run the backup function immediately on startup
cron.schedule('0 0 * * *', () => {
  backup();
});