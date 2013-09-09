/*!
 * DockerAgent Enhanced - hook - containers:create
 * Copyright(c) 2013 Jake Luer <jake@datalabs.io>
 * MIT Licensed
 */

/**
 * #### containers:create
 *
 * @param {Object} raw json
 * @param {Function} next
 * @hook `containers:create`
 */

module.exports = function(remote) {
  return function hookContainersCreate(raw, next) {
    var id = raw['Id'];
    var container = remote.container(id);
    next(null, container);
  };
};
