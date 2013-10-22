var proxyquire = require('proxyquire');

function mockModel(data) {
  this.__empty = !data;
  for (var key in data) {
    this[key] = data[key];
  }
}

mockModel.prototype.__type = function(typeName) {
  this.__type = typeName;
  return this;
};

mockModel.prototype.create = function(data) {
  var model = new mockModel(data);
  if (this.__type === 'user' && data.name === '') {
    model._error = {
      'name': 'User name invalid'
    };
  }
  return model;
};

mockModel.prototype.find = function(query) {
  if (this.__type === 'user' && query.where.name === 'nameAlreadyInUse') {
    return new mockModel({}).__type('user');
  } else if (this.__type === 'registration' && query.where[1] !== 'registrationNotFound@valid.com') {
    return new mockModel({
      emailAddress: query.where[1]
    }).__type("registration");
  }
  return new mockModel();
};

mockModel.prototype.save = function() {
  return this;
};

mockModel.prototype.success = function(cb) {
  if (!this._error) {
    cb(this.__empty ? null : this);
  }

  return this;
};

mockModel.prototype.error = function(cb) {
  if (this._error) {
    cb(this._error);
  }

  return this;
};

mockModel.prototype.setRegistration = function(cb) {
  return this;
};

var controller = require('../../app/controllers/_controller.js');
var user = proxyquire('../../app/controllers/user.js', {
  '../models': {
    registration: new mockModel().__type('registration'),
    user: new mockModel().__type('user')
  },
  '../libs': {
    logger: {
      error: function() {}
    }
  }
});

exports.user = {
  testValid: function(test) {
    var request = {
      body: {
        emailAddress: 'example@valid.com',
        secret: 'secret',
        key: 'key',
        name: 'example',
        password: 'test'
      }
    };
    controller.find(user, {
      "verb": "post"
    })(request,
      function(status, result) {
        test.ok(status === 200 || status === undefined);
        test.done();
      });
  },
  testNameAlreadyInUse: function(test) {
    var request = {
      body: {
        emailAddress: 'example@valid.com',
        secret: 'secret',
        key: 'key',
        name: 'nameAlreadyInUse',
        password: 'test'
      }
    };
    controller.find(user, {
      "verb": "post"
    })(request,
      function(status, result) {
        test.equals(status, 400);
        test.ok( !! result.error);
        test.done();
      });
  },
  testNameDoesNotMatchRegex: function(test) {
    var request = {
      body: {
        emailAddress: 'example@valid.com',
        secret: 'secret',
        key: 'key',
        name: '',
        password: 'test'
      }
    };
    controller.find(user, {
      "verb": "post"
    })(request,
      function(status, result) {

        test.ok(status === 400);
        test.ok( !! result.error.name);
        test.done();
      });
  },
  testRegistrationNotFound: function(test) {
    var request = {
      body: {
        emailAddress: 'registrationNotFound@valid.com',
        secret: 'secret',
        key: 'key',
        name: 'example',
        password: 'test'
      }
    };
    controller.find(user, {
      "verb": "post"
    })(request,
      function(status, result) {
        test.equals(status, 400);
        test.ok( !! result.error);
        test.done();
      });
  }
};
