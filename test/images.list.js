var IMAGE_NAME = [ 'busybox', 'ubuntu' ];

var Hash = require('gaia-hash').Hash;

describe('(hooks) images:list', function() {
  var remote = new dockeragent.Remote;
  remote.set('host', DOCKER_HOST);
  remote.set('port', DOCKER_PORT);

  var hook = enhanced['images:list'](remote);
  remote.hook('images:list', hook);

  before(addImage(IMAGE_NAME));

  it('results in a hash with valid objects', function(done) {
    remote.images(function(err, res) {
      should.not.exist(err);
      res.should.be.instanceof(Hash);
      res.should.have.length.gte(2);

      IMAGE_NAME.forEach(function(name) {
        var image = res.get(name);
        should.exist(image);
        image.should.be.an('object');
        image.should.have.property('repository', name);
        image.should.have.property('image');
        image.should.have.property('tags').an('array')
        image.tags.should.have.length.gte(1);
        image.tags.forEach(function(tag) {
          tag.should.be.an('object');
          tag.should.have.property('id').a('string');
          tag.should.have.property('created').a('date');
          tag.should.have.property('size').a('number');
          tag.should.have.property('virtual_size').a('number');
          tag.should.have.property('keys').an('array')
          tag.keys.should.have.length.gte(1);
        });
      });

      done();
    });
  });
});
