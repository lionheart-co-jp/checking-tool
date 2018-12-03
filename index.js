const carlo = require("carlo");
const os = require('os');
const path = require('path');

const AltLib = require('./lib/Alt');
const TitleLib = require('./lib/Title');
const HeadlineLib = require('./lib/Headline');
const UtilLib = require('./lib/Util');

(async () => {
  // Launch the browser.
  const app = await carlo.launch({
    title: 'Checker Support Tool',
    channel: ['canary', 'stable'],
    icon: path.join(__dirname, '/icon.icns'),
    args: process.env.DEV === 'true' ? ['--auto-open-devtools-for-tabs'] : [],
    localDataDir: path.join(os.homedir(), '.carlo-checktool'),
  });

  // Set Carlo expose function
  await app.exposeFunction('alt_request', AltLib.request)
  await app.exposeFunction('title_request', TitleLib.request)
  await app.exposeFunction('headline_request', HeadlineLib.request)
  await app.exposeFunction('util_url_to_base64', UtilLib.urlToBase64)
  await app.exposeFunction('util_screen_shot', UtilLib.screenShot(app))

  // Terminate Node.js process on app window closing.
  app.on("exit", () => process.exit());

  // Tell carlo where your web files are located.
  app.serveFolder(path.join(__dirname, 'dist'));

  // Navigate to the main page of your app.
  await app.load("index.html");
  return app;
})();