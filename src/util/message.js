const moment = require('moment');

function FormatMessage(userName, text) {
  return {
    userName,
    text,
    time: moment().format('h:mm a')
  }
}

module.exports = FormatMessage;
