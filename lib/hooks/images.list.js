/*!
 * DockerAgent Enhanced - hook - images:list
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
  return function hookImagesList(raw, next) {
    var res = hash();

    raw.forEach(function(row) {
      var name = row['Repository'];
      var entry;

      if (!res.has(name)) {
        entry = {};
        entry.repository = name;
        entry.image = remote.image(name);
        entry.tags = [];
        res.set(name, entry);
      } else {
        entry = res.get(name);
      }

      var tags = entry.tags;
      var tag = tags.filter(function(tag) {
        return tag.id === row['Id'];
      })[0] || null;

      if (!tag) {
        tag = {};
        tag.id = row['Id'];
        tag.created = new Date(row['Created'] * 1000);
        tag.size = row['Size'];
        tag.virtual_size = row['VirtualSize'];
        tag.keys = [];
        tags.push(tag);
      }

      tag.keys.push(row['Tag']);
    });

    next(null, res);
  };
};
