import puppeteer, { Browser, Page,PuppeteerLaunchOptions } from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const sleep = promisify(setTimeout);

const UPLOAD_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const VIDEOS_FOLDER = '/Users/anmolagarwal/Downloads/VideoSplitIntoShorts/split_videos/test'; // Change this to your video folder path

const YOUTUBE_EMAIL = 'nightowldevelopers@gmail.com'; // Change this to your YouTube email
const YOUTUBE_PASSWORD = 'hbkncbcmwziwaydy'; // Change this to your YouTube password
// const YOUTUBE_PASSWORD = 'Zxcvbnm#123'; // Change this to your YouTube password

const VIDEO_TITLE = 'Your Video Title';
const VIDEO_DESCRIPTION = 'Your Video Description';
const VIDEO_TAGS = ['tag1', 'tag2', 'tag3'];
const VIDEO_CATEGORY = '22'; // ID for the category "People & Blogs"

// Function to upload a video and schedule it for later publishing
async function uploadVideo(page: Page, videoPath: string): Promise<void> {
  try {
    // Navigate to the upload page
    await page.goto('https://www.youtube.com/upload', { waitUntil: 'networkidle0' });

    // Wait for the file input element to be visible
    const fileInput = await page.waitForSelector('input[type=file]');

    // Upload the video file
    const fullPath = path.resolve(videoPath);
    await fileInput.uploadFile(fullPath);

    // Wait for the video details form to be visible
    await page.waitForSelector('#meta');

    // Set the video details
    await page.type('#textbox', VIDEO_TITLE);
    await page.type('#description', VIDEO_DESCRIPTION);
    await page.type('#keywords', VIDEO_TAGS.join(','));
    await page.select('#category', VIDEO_CATEGORY);

    // Click the "Next" button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#next-button'),
    ]);

    // Wait for the visibility options to be visible
    await page.waitForSelector('#radio:private');

    // Select the privacy settings (e.g., private or public)
    await page.click('#radio:private > div > span > span:nth-child(1) > span');

    // Set the scheduled publishing time
    await page.click('#schedule > div:nth-child(2) > div > div > label > span:nth-child(1) > span:nth-child(2) > input');
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + UPLOAD_INTERVAL);
    const scheduledTimeString = scheduledTime.toLocaleTimeString('en-US', { hour12: false });
    await page.type('#scheduledTime', scheduledTimeString);

    // Click the "Next" button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#next-button'),
    ]);

    // Wait for the visibility options to be visible
    await page.waitForSelector('#container > div.upload-success > div > div > div.row > div.col-xs-3 > div');

    // Click the "Publish" button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#done-button'),
    ]);

    console.log(`Successfully uploaded video: ${videoPath}`);
  } catch (error) {
    console.error(`Error uploading video: ${videoPath}`, error);
  }
}

// Function to sign in to YouTube
async function signIn(page: Page): Promise<void> {
  try {
    // Navigate to YouTube
    await page.goto('https://accounts.youtube.com/accounts/', { waitUntil: 'networkidle0', timeout: 0 });

    // Click the Sign In button
    // await page.click('#signInButton');

    // Wait for the email field to be visible
    await page.waitForSelector('#identifierId');

    // Click on the email field
    await page.click('#identifierId');

    // Enter the email
    await page.type('#identifierId', YOUTUBE_EMAIL);

    // Click the Next button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 }),
      page.click('#identifierNext'),
    ]);

    // Wait for the password field to be visible
    await page.waitForSelector('input[name="password"]');

    // Enter the password
    await page.type('input[name="password"]', YOUTUBE_PASSWORD);

    // Click the Next button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 }),
      page.click('#passwordNext'),
    ]);

    console.log('Successfully signed in to YouTube');
  } catch (error) {
    console.error('Error signing in to YouTube', error);
  }
}


// Main function
async function main(): Promise<void> {
  try {
    // Launch the browser
    // const browser: Browser = await puppeteer.launch({ headless: false }); // Change headless to true for a headless execution
    const browser = await puppeteer.launch({
      executablePath:
        '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta',
      headless: false,
      userDataDir:
        '/Users/anmolagarwal/Library/Application Support/Google/Chrome Beta',
        ignoreDefaultArgs: ['--disable-extensions'],
    });


    
    const page: Page = await browser.newPage();

    // Sign in to YouTube
    await signIn(page);

    // Get the list of video files in the specified folder
    const videoFiles: string[] = await readdir(VIDEOS_FOLDER);

    // Iterate through the video files and upload/schedule them
    for (let i = 0; i < videoFiles.length; i++) {
      const videoFile: string = videoFiles[i];
      const videoPath: string = path.join(VIDEOS_FOLDER, videoFile);

      // Upload the video
      await uploadVideo(page, videoPath);

      // Wait for the specified interval before uploading the next video
      if (i < videoFiles.length - 1) {
        await sleep(UPLOAD_INTERVAL);
      }
    }

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
