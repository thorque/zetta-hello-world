var zetta = require('zetta');
var Photocell = require('../index');

zetta()
  .use(Photocell)
  .listen(1337);
