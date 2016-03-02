'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Portfoli = mongoose.model('Portfoli'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, portfoli;

/**
 * Portfoli routes tests
 */
describe('Portfoli CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new portfoli
    user.save(function () {
      portfoli = {
        title: 'Portfoli Title',
        content: 'Portfoli Content'
      };

      done();
    });
  });

  it('should be able to save an portfoli if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new portfoli
        agent.post('/api/portfolis')
          .send(portfoli)
          .expect(200)
          .end(function (portfoliSaveErr, portfoliSaveRes) {
            // Handle portfoli save error
            if (portfoliSaveErr) {
              return done(portfoliSaveErr);
            }

            // Get a list of portfolis
            agent.get('/api/portfolis')
              .end(function (portfolisGetErr, portfolisGetRes) {
                // Handle portfoli save error
                if (portfolisGetErr) {
                  return done(portfolisGetErr);
                }

                // Get portfolis list
                var portfolis = portfolisGetRes.body;

                // Set assertions
                (portfolis[0].user._id).should.equal(userId);
                (portfolis[0].title).should.match('Portfoli Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an portfoli if not logged in', function (done) {
    agent.post('/api/portfolis')
      .send(portfoli)
      .expect(403)
      .end(function (portfoliSaveErr, portfoliSaveRes) {
        // Call the assertion callback
        done(portfoliSaveErr);
      });
  });

  it('should not be able to save an portfoli if no title is provided', function (done) {
    // Invalidate title field
    portfoli.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new portfoli
        agent.post('/api/portfolis')
          .send(portfoli)
          .expect(400)
          .end(function (portfoliSaveErr, portfoliSaveRes) {
            // Set message assertion
            (portfoliSaveRes.body.message).should.match('Title cannot be blank');

            // Handle portfoli save error
            done(portfoliSaveErr);
          });
      });
  });

  it('should be able to update an portfoli if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new portfoli
        agent.post('/api/portfolis')
          .send(portfoli)
          .expect(200)
          .end(function (portfoliSaveErr, portfoliSaveRes) {
            // Handle portfoli save error
            if (portfoliSaveErr) {
              return done(portfoliSaveErr);
            }

            // Update portfoli title
            portfoli.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing portfoli
            agent.put('/api/portfolis/' + portfoliSaveRes.body._id)
              .send(portfoli)
              .expect(200)
              .end(function (portfoliUpdateErr, portfoliUpdateRes) {
                // Handle portfoli update error
                if (portfoliUpdateErr) {
                  return done(portfoliUpdateErr);
                }

                // Set assertions
                (portfoliUpdateRes.body._id).should.equal(portfoliSaveRes.body._id);
                (portfoliUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of portfolis if not signed in', function (done) {
    // Create new portfoli model instance
    var portfoliObj = new Portfoli(portfoli);

    // Save the portfoli
    portfoliObj.save(function () {
      // Request portfolis
      request(app).get('/api/portfolis')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single portfoli if not signed in', function (done) {
    // Create new portfoli model instance
    var portfoliObj = new Portfoli(portfoli);

    // Save the portfoli
    portfoliObj.save(function () {
      request(app).get('/api/portfolis/' + portfoliObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', portfoli.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single portfoli with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/portfolis/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Portfoli is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single portfoli which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent portfoli
    request(app).get('/api/portfolis/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No portfoli with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an portfoli if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new portfoli
        agent.post('/api/portfolis')
          .send(portfoli)
          .expect(200)
          .end(function (portfoliSaveErr, portfoliSaveRes) {
            // Handle portfoli save error
            if (portfoliSaveErr) {
              return done(portfoliSaveErr);
            }

            // Delete an existing portfoli
            agent.delete('/api/portfolis/' + portfoliSaveRes.body._id)
              .send(portfoli)
              .expect(200)
              .end(function (portfoliDeleteErr, portfoliDeleteRes) {
                // Handle portfoli error error
                if (portfoliDeleteErr) {
                  return done(portfoliDeleteErr);
                }

                // Set assertions
                (portfoliDeleteRes.body._id).should.equal(portfoliSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an portfoli if not signed in', function (done) {
    // Set portfoli user
    portfoli.user = user;

    // Create new portfoli model instance
    var portfoliObj = new Portfoli(portfoli);

    // Save the portfoli
    portfoliObj.save(function () {
      // Try deleting portfoli
      request(app).delete('/api/portfolis/' + portfoliObj._id)
        .expect(403)
        .end(function (portfoliDeleteErr, portfoliDeleteRes) {
          // Set message assertion
          (portfoliDeleteRes.body.message).should.match('User is not authorized');

          // Handle portfoli error error
          done(portfoliDeleteErr);
        });

    });
  });

  it('should be able to get a single portfoli that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new portfoli
          agent.post('/api/portfolis')
            .send(portfoli)
            .expect(200)
            .end(function (portfoliSaveErr, portfoliSaveRes) {
              // Handle portfoli save error
              if (portfoliSaveErr) {
                return done(portfoliSaveErr);
              }

              // Set assertions on new portfoli
              (portfoliSaveRes.body.title).should.equal(portfoli.title);
              should.exist(portfoliSaveRes.body.user);
              should.equal(portfoliSaveRes.body.user._id, orphanId);

              // force the portfoli to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the portfoli
                    agent.get('/api/portfolis/' + portfoliSaveRes.body._id)
                      .expect(200)
                      .end(function (portfoliInfoErr, portfoliInfoRes) {
                        // Handle portfoli error
                        if (portfoliInfoErr) {
                          return done(portfoliInfoErr);
                        }

                        // Set assertions
                        (portfoliInfoRes.body._id).should.equal(portfoliSaveRes.body._id);
                        (portfoliInfoRes.body.title).should.equal(portfoli.title);
                        should.equal(portfoliInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single portfoli if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new portfoli model instance
    portfoli.user = user;
    var portfoliObj = new Portfoli(portfoli);

    // Save the portfoli
    portfoliObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new portfoli
          agent.post('/api/portfolis')
            .send(portfoli)
            .expect(200)
            .end(function (portfoliSaveErr, portfoliSaveRes) {
              // Handle portfoli save error
              if (portfoliSaveErr) {
                return done(portfoliSaveErr);
              }

              // Get the portfoli
              agent.get('/api/portfolis/' + portfoliSaveRes.body._id)
                .expect(200)
                .end(function (portfoliInfoErr, portfoliInfoRes) {
                  // Handle portfoli error
                  if (portfoliInfoErr) {
                    return done(portfoliInfoErr);
                  }

                  // Set assertions
                  (portfoliInfoRes.body._id).should.equal(portfoliSaveRes.body._id);
                  (portfoliInfoRes.body.title).should.equal(portfoli.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (portfoliInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single portfoli if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new portfoli model instance
    var portfoliObj = new Portfoli(portfoli);

    // Save the portfoli
    portfoliObj.save(function () {
      request(app).get('/api/portfolis/' + portfoliObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', portfoli.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single portfoli, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Portfoli
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new portfoli
          agent.post('/api/portfolis')
            .send(portfoli)
            .expect(200)
            .end(function (portfoliSaveErr, portfoliSaveRes) {
              // Handle portfoli save error
              if (portfoliSaveErr) {
                return done(portfoliSaveErr);
              }

              // Set assertions on new portfoli
              (portfoliSaveRes.body.title).should.equal(portfoli.title);
              should.exist(portfoliSaveRes.body.user);
              should.equal(portfoliSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the portfoli
                  agent.get('/api/portfolis/' + portfoliSaveRes.body._id)
                    .expect(200)
                    .end(function (portfoliInfoErr, portfoliInfoRes) {
                      // Handle portfoli error
                      if (portfoliInfoErr) {
                        return done(portfoliInfoErr);
                      }

                      // Set assertions
                      (portfoliInfoRes.body._id).should.equal(portfoliSaveRes.body._id);
                      (portfoliInfoRes.body.title).should.equal(portfoli.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (portfoliInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Portfoli.remove().exec(done);
    });
  });
});
