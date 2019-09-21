const { Logger } = require('../Utilities/Logger');

function queryMsgReceived() {
  Logger.query(
    {
      limit: 1000,
      start: 0,
      order: 'asc',
      fields: ['message', 'timestamp'],
    },
    function(err, results) {
      results.file.forEach(log => {
        if (log.message.telegramMsgReceived) {
          const messageTxt = log.message.telegramMsgReceived.message.text;
          const sender = log.message.telegramMsgReceived.message.from.username;
          const timestamp = new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
          console.log(`[${timestamp}] :: ${sender} ==> ${messageTxt}`);
        }
      });
    }
  );
}

function queryMsgSent() {
  Logger.query(
    {
      limit: 1000,
      start: 0,
      order: 'asc',
      fields: ['message', 'timestamp'],
    },
    function(err, results) {
      console.log('\n\nMessages sent');
      results.file.forEach(log => {
        if (log.message.telegramMsgSent) {
          const messageTxt = log.message.telegramMsgSent.text;
          const sender = log.message.telegramMsgSent.from.username;
          const timestamp = new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
          console.log(`[${timestamp}] :: ${sender} ==> ${messageTxt}`);
        }
      });
    }
  );
}

queryMsgReceived();
queryMsgSent();
