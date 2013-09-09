var IMAGE_NAME = 'busybox';
var SIMPLE_SCRIPT = [ 'date' ];
var INFINITE_SCRIPT = [ '/bin/sh', '-c', 'echo "hello world" > /.dockeragent; while true; do echo hello universe; sleep 1; done' ]

var Hash = require('gaia-hash').Hash;

describe('(hooks) containers:list', function() {
  var remote = new dockeragent.Remote;
  remote.set('host', DOCKER_HOST);
  remote.set('port', DOCKER_PORT);

  var ns = 'containers:list';
  var hook = enhanced[ns](remote);
  remote.hook(ns, hook);

  var cr; // container running
  var cs; // container stopped

  before(addImage(IMAGE_NAME));
  before(function(done) {
    var opts = { Image: IMAGE_NAME, Cmd: INFINITE_SCRIPT, PortSpecs: [ '22', '9090/udp' ] };
    remote.create(opts, noErr(function(res) {
      cr = remote.container(res.Id);
      cr.start(noErr(function() { done(); }));
    }));
  });

  before(function(done) {
    var opts = { Image: IMAGE_NAME, Cmd: SIMPLE_SCRIPT };
    remote.create(opts, noErr(function(res) {
      cs = remote.container(res.Id);
      cs.wait(noErr(function() {
        setTimeout(done, 500); // ensure stopped
      }));
      cs.start();
    }));
  });

  after(function(done) {
    cr.stop(noErr(function() {
      cr.remove(noErr(done));
    }));
  });

  after(function(done) {
    cs.remove(noErr(done));
  });

  it('results in a hash with valid objects', function(done) {
    remote.containers(true, noErr(function(list) {
      list.should.be.instanceof(Hash);
      list.should.have.length.gte(2);

      var running = list.filter(function(row) {
        return cr.equal(row.id);
      }).at(0);

      running.should.have.property('container')
        .an.instanceof(cr.constructor);
      running.should.have.property('alive', true);
      running.should.have.property('code', null);
      running.should.have.property('command', INFINITE_SCRIPT.join(' '));
      running.should.have.property('created').a('date');
      running.should.have.property('ports')
        .an('array').with.length(2);

      var stopped = list.filter(function(row) {
        return cs.equal(row.id);
      }).at(0);

      stopped.should.have.property('container')
        .an.instanceof(cs.constructor);
      stopped.should.have.property('alive', false);
      stopped.should.have.property('code', 0);
      stopped.should.have.property('command', SIMPLE_SCRIPT.join(' '));
      stopped.should.have.property('created').a('date');
      stopped.should.have.property('ports')
        .an('array').with.length(0);

      done();
    }));
  });
});
