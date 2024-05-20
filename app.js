const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');
const fs = require('fs');

const CONFIG_FILE_NAME = './config.json';

const DEFAULT_GENDER_COLOR_MAP = {
  'M': '#89CFF0',
  'F': '#F4C2C2'
}

const app = express();

app.listen(process.env.PORT || 3000 );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let config = initConfig(CONFIG_FILE_NAME);

/**
 * Attempts to access and read the configuration file from the application directory.
 *
 * @param {string} fileName - The name of the configuration file to read / create
 *
 * @throws {TypeError} If the provided fileName is not a string.
 *
 * @example
 * // Sets the config variable equal to the configuration object read from file './config.json'
 * const config = initConfig('./config.json');
 *
 * @example
 * // Throws a TypeError due to an incorrect fileName value
 * const config = initConfig(1234);
 *
 * @author Bradley Hooten <hello@bradleyh.me>
 * @since 1.0
 */
function initConfig(fileName) {
  // Define default configuration values as a fallback
  const defaultConfig = {
    revealTime: '2025-01-01T00:00:00',
    children: [{
      gender: 'F',
      genderName: 'girl',
      childName: 'Jane'
    }],
    pageTitle: 'Smith\'s Gender Reveal'
  }

  // Validate string input prior to reading in file
  if(typeof fileName !== 'string') {
    // fileName is not a string and is not proper input; throw TypeError
    throw new TypeError('fileName must be a string');
  }

  let file;
  let config = {};

  // Open a try / catch block for the file read, due to potential for error due to non-existence / whatnot
  try {
    file = fs.readFileSync(fileName, 'utf-8');
    console.log(`Successfully read config file ${fileName} from disk. Preparing to parse...`);
  } catch(err) {
    if(err.code === 'ENOENT') {
      // File does not exist, let's create it!
      try {
        fs.writeFileSync(fileName, JSON.stringify(defaultConfig, null, 2));

        console.log(`Configuration file successfully written to ${fileName}. Update the parameters as desired, then restart the application!`);
      } catch(err2) {
        console.warn('Configuration file does not exist and could not be written:\n' + err);
      }
    }
    else {
      console.warn(`An unexpected error occurred while attempting to read configuration:\n${err}`);
    }

    return defaultConfig;
  }

  // Proceed into try / catch logic for JSON parsing
  try {
    config = JSON.parse(file);
    let writebackToFile = false;

    // Compare defaultConfig object against config object to confirm all values are present and handle if not
    for(let key of Object.keys(defaultConfig)) {
      if(!config.hasOwnProperty(key)) {
        // Value present in default is not found in read config file; log warning and provide default
        console.warn(`Required configuration value '${key}' is not present. Adding to config file and proceeding with default value: ${defaultConfig[key]}`);
        config[key] = defaultConfig[key];
      }
    }

    // Begin additional config file processing
    if(!config.revealBackgroundColor) {
      config.revealBackgroundColor = DEFAULT_GENDER_COLOR_MAP[config.children[0].gender.toUpperCase()] || '#D3D3D3';
    }

    // Complete internal conversion from localized date / time to UTC for transfer to client
    config.revealTime = new Date(config.revealTime).toISOString();

    // Open new try / catch block to handle writing back default config values to file
    try {
      fs.writeFileSync(fileName, JSON.stringify(config, null, 2));
    } catch(err) {
      console.warn(`Failed to write default values back to the configuration file:\n${err}`);
    }
  } catch(err) {
    console.warn(`An error occurred while attempting to parse the configuration file:\n${err}`)
  }

  return config || defaultConfig;
}

app.get('/api/genderReveal', function(req, res) {
  const reqUUID = crypto.randomUUID();
  let responseData = { requestId: reqUUID, revealTime: config.revealTime, backgroundColor: '#FFFFFF' };

  if(Date.now() > Date.parse(config.revealTime) - 400) {
    responseData.children = config.children;
    responseData.backgroundColor = config.revealBackgroundColor;
  }

  res.status(200).end(JSON.stringify(responseData));
});

app.get('/*', function(req, res) {
  const reqUUID = crypto.randomUUID();
  const responseData = { requestId: reqUUID, revealTime: config.revealTime, backgroundColor: '#FFFFFF', title: config.pageTitle };

  // If the reveal time has passed, add the proper response attributes
  if(Date.now() > Date.parse(config.revealTime)) {
    responseData.gender = config.gender;
    responseData.backgroundColor = config.genderColor;
  }

  console.log(`Dispatched the following request: ${JSON.stringify(responseData)}`);

  res.status(200).render('index', responseData);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { errorMessage: err.message, statusCode: err.status || 500 });

  console.log(err);
});

module.exports = app;
