require('dotenv').config();

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOEKN = process.env.REFRESH_TOEKN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REFRESH_TOEKN, REDIRECT_URL);
oauth2Client.setCredentials({refresh_token: REFRESH_TOEKN});

const drive = google.drive({
    version: 'v3',
    auth : oauth2Client
});

module.exports = {
    updateFile: async () => {
        try{
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
        catch(error){
            console.error(error);
        }
    },
    deleteFile: async (fileId) => {
        try{
            const deleteData = await drive.files.delete({
                fileId: fileId
            })
            console.log('upload done', deleteData.data)
        }
        catch(error){
            console.error(error);
        }
    },
    listFiles : async (name) => {
        try {
          const files = await drive.files.list({
            pageSize: 10, // Số lượng tệp bạn muốn lấy
            fields: 'nextPageToken, files(id, name)', // Thông tin bạn muốn lấy cho mỗi tệp
            q: `name contains '${name}'`,
          });
      
          const fileList = files.data.files;
          if (fileList.length > 0) {
            console.log('Files:');
            fileList.forEach((file) => {
              console.log(`${file.name} (${file.id})`);
            });
          } else {
            console.log('No files found.');
          }
        } catch (error) {
          console.error('Error listing files:', error);
        }
      }
}