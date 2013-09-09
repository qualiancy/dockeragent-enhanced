/*!
 * DockerAgent Enhanced - hook - containers:list
 * Copyright(c) 2013 Jake Luer <jake@datalabs.io>
 * MIT Licensed
 */

var hash = require('gaia-hash');

/**
 * #### container:top
 *
 * Reformats top results. Returns array
 * of processes which each line being an object
 * of column:value pairs.
 *
 * @param {Object} raw json
 * @param {Function} next
 * @hook `container:top`
 */

module.exports = function(remote) {
  return function hookContainersList(raw, next) {
    var res = hash();

    raw.forEach(function(row) {
      var id = row['Id'];
      var entry = {};
      res.set(id, entry);

      entry.id = id;
      entry.container = remote.container(id);
      entry.image = row['Image'];
      entry.created = new Date(row['Created'] * 1000);
      entry.command = row['Command'].trim();
      entry.alive = !!!~row['Status'].indexOf('Exit');
      entry.code = !entry.alive ? parseFloat(row['Status'].split(' ')[1]) : null;
      entry.status = row['Status'];
      entry.ports = [];

      if (row['Ports'].trim().length) {
        var ports = row['Ports'].trim().split(', ');
        ports.forEach(function(port) {
          var match = /^(\d+)->(\d+)\/?(udp)?$/.exec(port);
          if (!match) return;
          var spec = { public: match[1], private: match[2] };
          spec.flag = match[3] || 'ip4';
          entry.ports.push(spec);
        });
      }
    });

    next(null, res);
  };
};
