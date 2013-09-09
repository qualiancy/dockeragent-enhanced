/*!
 * DockerAgent - enhanced hooks bootstrap
 * Copyright(c) 2013 Jake Luer <jake@datalabs.io>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var debug = require('sherlock')('dockeragent-enhanced');

/*!
 * Primary exports
 */

var exports = module.exports = mount;

/*!
 * Mount all hooks
 */

function mount(remote) {
  var hook;
  var name;

  for (name in exports) {
    hook = exports[name](remote);
    debug('(mount) %s %s', name, hook.name || '');
    remote.hook(name, hook);
  }

  return remote;
};

/*!
 * Export individual hooks for cherry-picking.
 */

exports['container:create'] = require('./hooks/container.create');
exports['containers:list'] = require('./hooks/containers.list');
exports['container:top'] = require('./hooks/container.top');
exports['images:list'] = require('./hooks/images.list');
