var IMAGE_NAME = 'busybox';
var SIMPLE_SCRIPT = [ 'date' ];
var INFINITE_SCRIPT = [ '/bin/sh', '-c', 'echo "hello world" > /.dockeragent; while true; do echo hello universe; sleep 1; done' ]

var Hash = require('gaia-hash').Hash;

describe('(hooks) containers:create', function() {
  var remote = new dockeragent.Remote;
  remote.set('host', DOCKER_HOST);
  remote.set('port', DOCKER_PORT);

  var ns = 'container:create';
  var hook = enhanced[ns](remote);
  remote.hook(ns, hook);

  before(addImage(IMAGE_NAME));

  it('returns a constructed container', function(done) {
    var opts = { Image: IMAGE_NAME, Cmd: SIMPLE_SCRIPT };
    var noop = remote.container('noop');
    remote.create(opts, noErr(function(res) {
      res.should.be.instanceof(noop.constructor);
      res.should.have.property('id').a('string');
      res.remove(noErr(function() {
        done();
      }));
    }));
  });
});
