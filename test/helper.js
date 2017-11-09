'use strict';
const path = require('path');
global.run=function(call){
  require(path.join(__dirname, '../index.js'));
  call(function (err) {
    if (err) {
      process.send(err.toString());
    } else {
      process.send('done');
    }
  });
}
