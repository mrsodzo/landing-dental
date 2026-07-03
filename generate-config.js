const fs = require('fs');
fs.writeFileSync('js/config.js', `window.TELEGRAM_BOT_TOKEN = '${process.env.TELEGRAM_BOT_TOKEN}';\nwindow.TELEGRAM_CHAT_ID = '${process.env.TELEGRAM_CHAT_ID}';\n`);
