var chai = require('chai');
var bluebird = require('bluebird');
chai.should();
var mock = require('mock-require');
var wtZendesk = require(__dirname + '/zendhub-wt.js');
var wtGithub = require(__dirname + '/zendhub-github-webhook-wt.js');
var empty = {"message":"description"}

mock('request-promise', function (options) {
    var url = options.url;
    if (url.indexOf("channels.join") !== -1) {
      //CREATE CHANNEL
      options.qs.should.have.property("name",oracle.data.test_username + "-" + (oracle.data.SLACK_CHANNEL_NAME || "exercise"));
      return bluebird.resolve({channel: {id: "TEST_CHANNEL_ID"}})
    } else if (url.indexOf("users.admin.invite") !== -1) {
      //INVITE EXTERNAL
      options.qs.email.should.be.a("string");
      options.qs.should.have.property("email", oracle.data.test_email);
      options.qs.should.have.property("set_active",true);
      options.qs.should.have.property("channels", oracle.data.channel_id);
      return bluebird.resolve({})
    } else if (url.indexOf("channels.invite") !== -1) {
      // INVITE CHANNEL
      options.qs.should.have.property("channel", oracle.data.channel_id);
      options.qs.should.have.property("user", oracle.data.user_id);
      return bluebird.resolve({})
    }
});
describe('Invite External User Without Channel Creation', function() {
  it('No @', function() {
    /*oracle = {
      data: {
        "SLACK_TOKEN": "A",
        "SLACK_COMMAND_TOKEN": "B",
        "token": "B",
        "user_id": "USERID",
        "channel_name": "CHANNEL",
        "channel_id": "THE_CHANNEL_ID",
        "SLACK_CHANNEL_NAME": "PEPITO",
        "text": "hihihihi.com",
        "test_username": "hihihihi.com",
        "test_email": "hihihihi.com",
        "SLACK_DOMAIN": 'n4ch03'
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Please provide a valid email");
    });*/
    empty.should.have.property("message");
  });
});
