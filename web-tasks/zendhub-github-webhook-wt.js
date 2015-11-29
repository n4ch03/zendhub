"use latest";

var request = require('request-promise');

var zendeskCredentials;

module.exports = function (context, cb) {
  var re = /\[ZendeskId:(.*)\]/m;
  var title = context.data.issue.title;
  var zendeskTicketID;
  zendeskCredentials = {
    username: context.data.ZENDESK_USERNAME,
    password: context.data.ZENDESK_PASSWORD,
    domain: context.data.ZENDESK_DOMAIN
  };
  console.log(zendeskCredentials);

  if (!isConfiguredProperly()) {
    return cb(409, {"message": "Sorry your webtask does not have " +
      "all the parameters configured correctly please check README"});
  }

  if (context.data.action === 'closed' && re.test(title)) {
    zendeskTicketID = title.match(re)[1];
    var zendeskClient = new ZendeskClient();
    zendeskClient.updateGithubIssue(zendeskTicketID)
    .then(function (json) {
      return cb(null, '{"result": "ok"}');
    }).catch(function(err) {
      return cb(err, null);
    });
  } else {
    return cb(null, '{"result": "ok"}');
  }

}


function ZendeskClient() {

}

ZendeskClient.prototype.updateGithubIssue = function(ticketId) {
  var auth = "Basic " + new Buffer(zendeskCredentials.username + ":"
            + zendeskCredentials.password).toString("base64");
  var options = {
    json: true,
    method: 'PUT',
    uri: 'https://'+ zendeskCredentials.domain +'.zendesk.com/api/v2/tickets/'
          + ticketId + '/tags.json ',
    headers : {
      "Authorization" : auth
    },
    body: {
      tags: ["GITHUB-CLOSED"]
    }
  }
  return request(options);

}

function isConfiguredProperly() {
  return (zendeskCredentials.username !== undefined &&
      zendeskCredentials.password !== undefined &&
      zendeskCredentials.domain !== undefined)
}
