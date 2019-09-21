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
          if (log.message.telegramMsgReceived.msgType === 'text') {
            const messageTxt = log.message.telegramMsgReceived.message.text;
            const sender = log.message.telegramMsgReceived.message.from.username;
            const timestamp = new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
            console.log(`[${timestamp}] :: ${sender} ==> ${messageTxt}`);
          }

          if (log.message.telegramMsgReceived.msgType === 'callback_query') {
            const messageTxt = log.message.telegramMsgReceived.query.data;
            const sender = log.message.telegramMsgReceived.query.from.username;
            const timestamp = new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
            console.log(`[${timestamp}] :: ${sender} ==> ${messageTxt}`);
          }
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
          if (log.message.telegramMsgSent.text) {
            const messageTxt = log.message.telegramMsgSent.text;
            const sender = log.message.telegramMsgSent.from.username;
            const timestamp = new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
            console.log(`[${timestamp}] :: ${sender} ==> ${messageTxt}`);
          }
        }
      });
    }
  );
}

queryMsgReceived();
queryMsgSent();
