const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { uploadBackupFolder } = require('./Update.model');

const backup = async () => {
    try {
        const backupDir = path.join(__dirname, '../'); // Use path.join for cross-platform compatibility
        const backupDirE = path.join(__dirname, '../truyenvui');
        // Create a backup directory if it doesn't exist
        try {
            if (fs.existsSync(backupDirE)) {
                fs.rmSync(backupDirE, { recursive: true }); // Sử dụng tùy chọn { recursive: true } để xóa thư mục và nội dung bên trong (Node.js v12+)
            }
        } catch (err) {
            // Xảy ra lỗi khi xóa thư mục, bạn có thể xử lý nó ở đây
            console.error(`Error deleting backup directory: ${err.message}`);
        }
        if (!fs.existsSync(backupDirE)) {
            fs.mkdirSync(backupDirE);
        }


        // Execute the mongodump command to backup the MongoDB database
        exec(`mongodump --uri=mongodb://103.252.137.158:27018/truyenvui --out ${backupDir}`).on('exit', (code, signal) => {
            if (code === 0) {
                // Backup was successful, you can now proceed with the upload

            } else {
                console.error(`mongodump process exited with code ${code} and signal ${signal}`);
            }
        });

        uploadBackupFolder()
            .then(() => {
                console.log('Backup completed successfully.');
            })
            .catch((uploadError) => {
                console.error(`Upload failed: ${uploadError.message}`);
            });

    } catch (error) {
        console.error(`Backup process failed: ${error.message}`);
    }
};

// Run the backup function immediately on startup

module.exports = backup;