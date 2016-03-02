'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contac = mongoose.model('Contac'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, contac;

/**
 * Contac routes tests
 */
describe('Contac CRUD tests', function () {

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

    // Save a user to the test db and create new contac
    user.save(function () {
      contac = {
        title: 'Contac Title',
        content: 'Contac Content'
      };

      done();
    });
  });

  it('should be able to save an contac if logged in', function (done) {
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

        // Save a new contac
        agent.post('/api/contacs')
          .send(contac)
          .expect(200)
          .end(function (contacSaveErr, contacSaveRes) {
            // Handle contac save error
            if (contacSaveErr) {
              return done(contacSaveErr);
            }

            // Get a list of contacs
            agent.get('/api/contacs')
              .end(function (contacsGetErr, contacsGetRes) {
                // Handle contac save error
                if (contacsGetErr) {
                  return done(contacsGetErr);
                }

                // Get contacs list
                var contacs = contacsGetRes.body;

                // Set assertions
                (contacs[0].user._id).should.equal(userId);
                (contacs[0].title).should.match('Contac Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an contac if not logged in', function (done) {
    agent.post('/api/contacs')
      .send(contac)
      .expect(403)
      .end(function (contacSaveErr, contacSaveRes) {
        // Call the assertion callback
        done(contacSaveErr);
      });
  });

  it('should not be able to save an contac if no title is provided', function (done) {
    // Invalidate title field
    contac.title = '';

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

        // Save a new contac
        agent.post('/api/contacs')
          .send(contac)
          .expect(400)
          .end(function (contacSaveErr, contacSaveRes) {
            // Set message assertion
            (contacSaveRes.body.message).should.match('Title cannot be blank');

            // Handle contac save error
            done(contacSaveErr);
          });
      });
  });

  it('should be able to update an contac if signed in', function (done) {
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

        // Save a new contac
        agent.post('/api/contacs')
          .send(contac)
          .expect(200)
          .end(function (contacSaveErr, contacSaveRes) {
            // Handle contac save error
            if (contacSaveErr) {
              return done(contacSaveErr);
            }

            // Update contac title
            contac.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing contac
            agent.put('/api/contacs/' + contacSaveRes.body._id)
              .send(contac)
              .expect(200)
              .end(function (contacUpdateErr, contacUpdateRes) {
                // Handle contac update error
                if (contacUpdateErr) {
                  return done(contacUpdateErr);
                }

                // Set assertions
                (contacUpdateRes.body._id).should.equal(contacSaveRes.body._id);
                (contacUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of contacs if not signed in', function (done) {
    // Create new contac model instance
    var contacObj = new Contac(contac);

    // Save the contac
    contacObj.save(function () {
      // Request contacs
      request(app).get('/api/contacs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single contac if not signed in', function (done) {
    // Create new contac model instance
    var contacObj = new Contac(contac);

    // Save the contac
    contacObj.save(function () {
      request(app).get('/api/contacs/' + contacObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', contac.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single contac with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contacs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contac is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single contac which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent contac
    request(app).get('/api/contacs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No contac with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an contac if signed in', function (done) {
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

        // Save a new contac
        agent.post('/api/contacs')
          .send(contac)
          .expect(200)
          .end(function (contacSaveErr, contacSaveRes) {
            // Handle contac save error
            if (contacSaveErr) {
              return done(contacSaveErr);
            }

            // Delete an existing contac
            agent.delete('/api/contacs/' + contacSaveRes.body._id)
              .send(contac)
              .expect(200)
              .end(function (contacDeleteErr, contacDeleteRes) {
                // Handle contac error error
                if (contacDeleteErr) {
                  return done(contacDeleteErr);
                }

                // Set assertions
                (contacDeleteRes.body._id).should.equal(contacSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an contac if not signed in', function (done) {
    // Set contac user
    contac.user = user;

    // Create new contac model instance
    var contacObj = new Contac(contac);

    // Save the contac
    contacObj.save(function () {
      // Try deleting contac
      request(app).delete('/api/contacs/' + contacObj._id)
        .expect(403)
        .end(function (contacDeleteErr, contacDeleteRes) {
          // Set message assertion
          (contacDeleteRes.body.message).should.match('User is not authorized');

          // Handle contac error error
          done(contacDeleteErr);
        });

    });
  });

  it('should be able to get a single contac that has an orphaned user reference', function (done) {
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

          // Save a new contac
          agent.post('/api/contacs')
            .send(contac)
            .expect(200)
            .end(function (contacSaveErr, contacSaveRes) {
              // Handle contac save error
              if (contacSaveErr) {
                return done(contacSaveErr);
              }

              // Set assertions on new contac
              (contacSaveRes.body.title).should.equal(contac.title);
              should.exist(contacSaveRes.body.user);
              should.equal(contacSaveRes.body.user._id, orphanId);

              // force the contac to have an orphaned user reference
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

                    // Get the contac
                    agent.get('/api/contacs/' + contacSaveRes.body._id)
                      .expect(200)
                      .end(function (contacInfoErr, contacInfoRes) {
                        // Handle contac error
                        if (contacInfoErr) {
                          return done(contacInfoErr);
                        }

                        // Set assertions
                        (contacInfoRes.body._id).should.equal(contacSaveRes.body._id);
                        (contacInfoRes.body.title).should.equal(contac.title);
                        should.equal(contacInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single contac if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new contac model instance
    contac.user = user;
    var contacObj = new Contac(contac);

    // Save the contac
    contacObj.save(function () {
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

          // Save a new contac
          agent.post('/api/contacs')
            .send(contac)
            .expect(200)
            .end(function (contacSaveErr, contacSaveRes) {
              // Handle contac save error
              if (contacSaveErr) {
                return done(contacSaveErr);
              }

              // Get the contac
              agent.get('/api/contacs/' + contacSaveRes.body._id)
                .expect(200)
                .end(function (contacInfoErr, contacInfoRes) {
                  // Handle contac error
                  if (contacInfoErr) {
                    return done(contacInfoErr);
                  }

                  // Set assertions
                  (contacInfoRes.body._id).should.equal(contacSaveRes.body._id);
                  (contacInfoRes.body.title).should.equal(contac.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (contacInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single contac if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new contac model instance
    var contacObj = new Contac(contac);

    // Save the contac
    contacObj.save(function () {
      request(app).get('/api/contacs/' + contacObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', contac.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single contac, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Contac
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

          // Save a new contac
          agent.post('/api/contacs')
            .send(contac)
            .expect(200)
            .end(function (contacSaveErr, contacSaveRes) {
              // Handle contac save error
              if (contacSaveErr) {
                return done(contacSaveErr);
              }

              // Set assertions on new contac
              (contacSaveRes.body.title).should.equal(contac.title);
              should.exist(contacSaveRes.body.user);
              should.equal(contacSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the contac
                  agent.get('/api/contacs/' + contacSaveRes.body._id)
                    .expect(200)
                    .end(function (contacInfoErr, contacInfoRes) {
                      // Handle contac error
                      if (contacInfoErr) {
                        return done(contacInfoErr);
                      }

                      // Set assertions
                      (contacInfoRes.body._id).should.equal(contacSaveRes.body._id);
                      (contacInfoRes.body.title).should.equal(contac.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (contacInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Contac.remove().exec(done);
    });
  });
});
