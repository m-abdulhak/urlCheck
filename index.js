const axios = require('axios');
const player = require('play-sound')();
const fs = require('fs');
const path = require('path');

// Replace with the URL you want to check and the expected response
const urlToCheck = 'https://www.mrdappointments.gov.nl.ca/qmaticwebbooking/rest/schedule/branches/0530213b59d05514353e5567e29db9c9f2393c85c284456cfd410162fd44fa8d/dates;servicePublicId=378dcad3a2874a41a1018cb96d57a21c63912e1884dead32d94d14b244abe8ae;customSlotLength=30';
const expectedResponse = '[]';

const getTime = () => {
    const now = new Date();
    const options = {
    year: 'numeric', 
    month: 'long',
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric'
    };

    const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(now);

    return formattedDate;
} 

const logFilePath = path.join(__dirname, `logs/${Date.now()}.txt`);

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ''); // Create an empty log file
}

const log = (msg) => {
    console.log(msg);
    fs.appendFile(logFilePath, `${msg}\n`, (err) => {
        if (err) {
          console.error(`Error writing to log file: ${err}`);
        }
    });
};


const checkWebsite = async () => {
  try {
    const response = JSON.stringify((await axios.get(urlToCheck)).data);
    log(`${getTime()}: ${JSON.stringify(response)}`); 

    if (response != expectedResponse) {
      log('SUCCESS!');
      player.play('./alarm.wav', (err) => {
        if (err) {
          log(`Error playing sound: ${err}`);
        }
      });
    } else {
      log('No appointments found!');
    }
  } catch (error) {
    log(`Error checking ${urlToCheck}: ${error.message}`);
  }
};

// Perform the initial check
checkWebsite();

// Schedule checks every 30 seconds
const interval = 10 * 1000; // 30 seconds in milliseconds
setInterval(checkWebsite, interval);
