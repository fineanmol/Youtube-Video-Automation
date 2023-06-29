# YouTube Video Uploader

This script automates the process of uploading videos to YouTube and scheduling them for publishing. It uses Puppeteer, a Node.js library for controlling a headless Chrome browser.

## Prerequisites

Before running this script, make sure you have the following:

- Node.js installed on your machine.
- A Google account with access to YouTube.
- Video files that you want to upload.

## Installation

1. Clone this repository to your local machine or download the script file directly.

2. Open a terminal or command prompt and navigate to the directory where the script is located.

3. Install the dependencies by running the following command:

```
npm install puppeteer
```

## Usage

1. Open the script file and configure the following variables according to your needs:

- `UPLOAD_INTERVAL`: The interval (in milliseconds) between video uploads.
- `VIDEOS_FOLDER`: The path to the folder where your video files are located.
- `YOUTUBE_EMAIL`: Your YouTube email.
- `YOUTUBE_PASSWORD`: Your YouTube password.
- `VIDEO_TITLE`: The title of the video.
- `VIDEO_DESCRIPTION`: The description of the video.
- `VIDEO_TAGS`: An array of tags for the video.
- `VIDEO_CATEGORY`: The category ID for the video (e.g., "22" for "People & Blogs").

2. Save the changes to the script file.

3. Open a terminal or command prompt and navigate to the directory where the script is located.

4. Run the script using the following command:

```
node youtube-uploader.js
```

5. The script will launch a browser and sign in to your YouTube account.

6. It will then upload each video file in the specified folder and schedule them for publishing according to the configured interval.

7. Monitor the console output for information about the upload process.

## Customization

Feel free to customize and modify the script as per your requirements. You can change the upload interval, video details, and add additional functionality if needed.

## Important Note

Make sure to use this script responsibly and adhere to YouTube's terms of service. Respect the platform's guidelines and policies regarding video uploads and scheduling.

**Note:** For security reasons, avoid committing your YouTube credentials (email and password) to version control repositories or sharing them with others.

If you encounter any issues or have any questions, please feel free to reach out. Happy video uploading!
