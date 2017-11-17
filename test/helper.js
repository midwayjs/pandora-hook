'use strict';
const path = require('path');
const globby = require('globby');

global.run = function(call) {

  call(function(err) {
    if (err) {
      console.error(err);
      process.send(err.toString());
    } else {
      process.send('done');
    }
  });
};