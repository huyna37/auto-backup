require('dotenv').config();

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOEKN = process.env.REFRESH_TOEKN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REFRESH_TOEKN, REDIRECT_URL);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOEKN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

module.exports = {
  updateFile: async () => {
    try {
      const createFile = await drive.files.create({
        requestBody: {
          name: 'backup',
          mimeType: 'image/jpg'
        },
        media: {
          mimeType: 'image/jpg',
          body: fs.createReadStream(path.join(__dirname, '../crp.jpg'))
        }
      })
      console.log('upload done', createFile.data)
    }
    catch (error) {
      console.error(error);
    }
  },
  deleteFile: async (fileId) => {
    try {
      const deleteData = await drive.files.delete({
        fileId: fileId
      })
      console.log('upload done', deleteData.data)
    }
    catch (error) {
      console.error(error);
    }
  },
  uploadBackupFolder: async () => {
    try {
      // Tạo một thư mục mới trên Google Drive với tên và ngày tạo tương ứng
      const currentDate = new Date().toISOString().replace(/:/g, '-');
      const folderName = `Backup_${currentDate}`;
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };
      const createFolder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });
      const folderId = createFolder.data.id;

      // Lấy danh sách tệp trong thư mục "backups" của bạn
      const backupDir = path.join(__dirname, '../backups');
      if (!fs.existsSync(backupDir)) {
        return;
      }
      const backupFiles = fs.readdirSync(backupDir);

      // Tải lên từng tệp vào thư mục mới trên Google Drive
      for (const backupFile of backupFiles) {
        const fileMetadata = {
          name: backupFile,
          parents: [folderId],
        };
        await drive.files.create({
          resource: fileMetadata,
          media: {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(path.join(backupDir, backupFile)),
          },
        });
      }

      console.log(`Backup folder "${folderName}" uploaded to Google Drive.`);
    } catch (error) {
      console.error('Error uploading backup folder:', error);
    }
  },
}