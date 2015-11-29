"use latest";

var request = require('request-promise');

var zendeskCredentials, githubCredentials;


module.exports =
    function (context, cb) {
      var zendeskClient = new ZendeskClient();
      var githubClient = new GithubClient();
      var ticketId = context.data.ticket;
      var ticket, customFields;

      zendeskCredentials = {
        username: context.data.ZENDESK_USERNAME,
        password: context.data.ZENDESK_PASSWORD,
        domain: context.data.ZENDESK_DOMAIN,
        githubField: Number(context.data.ZENDESK_GITHUB_FIELD_ID)
      };
      githubCredentials = {
        username: context.data.GITHUB_USERNAME,
        password: context.data.GITHUB_PASSWORD,
        repo: context.data.GITHUB_REPO
      };

      if (!isConfiguredProperly()) {
        return cb(409, {"message": "Sorry your webtask does not have " +
          "all the parameters configured correctly please check README"});
      }

      zendeskClient.getTicket(ticketId)
      .then(function(json) {
        ticket = json.ticket;
        customFields = json.ticket.custom_fields;
        return zendeskClient.getComments(ticketId);
      }).then(function (json) {
        var githubIssue = getGithubIssue(customFields);
        if (githubIssue > 0) {
          return githubClient.updateTicket(githubIssue, ticket, json);
        } else {
          return githubClient.createTicket(ticket, json);
        }
      }).then(function (json) {
        return zendeskClient.updateGithubIssue(ticketId, json.number, customFields);
      }).then(function (json) {
        cb(null, "YES YES YES YES");
      }).catch(function(err) {
        cb(err, null);
      });
    };

function ZendeskClient() {

}

ZendeskClient.prototype.getTicket = function(ticketId) {
  var options = getBaseOptions(zendeskCredentials);
  options.method = 'GET';
  options.uri = 'https://'+ zendeskCredentials.domain +'.zendesk.com/api/v2/tickets/'
        + ticketId + '.json ';
  return request(options);
}

ZendeskClient.prototype.updateGithubIssue = function(ticketId, githubIssueId, customFields) {
  var needsUpdate = false;
  customFields.forEach(function(custom){
    if (custom.id === zendeskCredentials.githubField) {
      needsUpdate = true;
      custom.value = githubIssueId;
    }
  });
  if (needsUpdate) {
    var options = getBaseOptions(zendeskCredentials);
    options.method = 'PUT';
    options.uri = 'https://'+ zendeskCredentials.domain +'.zendesk.com/api/v2/tickets/'
          + ticketId + '.json ';
    options.body = {
      ticket: {
        custom_fields: customFields
      }
    };
    return request(options);
  } else {
    return null;
  }

}

ZendeskClient.prototype.getComments = function(ticketId) {
  var options = getBaseOptions(zendeskCredentials);

  options.method = 'GET';
  options.uri = 'https://'+ zendeskCredentials.domain +'.zendesk.com/api/v2/tickets/'
        + ticketId + '/comments.json?include=users&sort_order=desc';
  return request(options);
}

function GithubClient() {

}

GithubClient.prototype.createTicket = function(ticket, commentsJson) {
  var options = getBaseOptions(githubCredentials);
  options.method = 'POST';
  options.body = {
    title: "[ZendeskId:" + ticket.id + "]:" + ticket.subject,
    body: this.buildBody(ticket, commentsJson),
    labels: ["SupportEscalation"]
  };
  options.uri = 'https://api.github.com/repos/' + githubCredentials.repo + '/issues';
  this.attachUA(options);
  return request(options);
}

GithubClient.prototype.updateTicket = function(issueId, ticket, commentsJson) {
  var options = getBaseOptions(githubCredentials);
  options.method = 'PATCH';
  options.body = {
    title: "[ZendeskId:" + ticket.id + "]:" + ticket.subject,
    body: this.buildBody(ticket, commentsJson)
  };
  options.uri = 'https://api.github.com/repos/' + githubCredentials.repo + '/issues/' + issueId;
  this.attachUA(options);
  return request(options);
}

GithubClient.prototype.buildBody = function(ticket, commentsJson) {
  var users = this.getUsers(commentsJson.users);
  var commentSummary = '* Ticket Status: **' + ticket.status +'**\r\n';
  if (ticket.priority !== null) {
    commentSummary += '* Ticket Priority: **' + ticket.priority +'**\r\n';
  }
  if (ticket.type !== null) {
    commentSummary += '* Ticket Type: **' + ticket.type +'**\r\n';
  }
  commentSummary += '\r\n';
  commentsJson.comments.forEach(function(comment) {
    commentSummary += "### Time Created: " + comment.created_at + "\r\n";
    if (comment.updated_at !== undefined) {
      commentSummary += "### Time Updated: " + comment.updated_at + "\r\n";
    }
    commentSummary += "![](" + users[comment.author_id].photo.content_url
                      + ")" + "\r\n";
    commentSummary += "**Name** " + users[comment.author_id].name + "\r\n";
    if (comment.public) {
      commentSummary += "**Comment** " + comment.body + "\r\n";
    } else {
      commentSummary += "**Internal Comment** " + comment.body + "\r\n";
    }

  });
  return commentSummary;
}

GithubClient.prototype.getUsers = function(users) {
  var usersObj = {};
  users.forEach(function(user) {
    usersObj[user.id] = user;
  });
  return usersObj;
}

GithubClient.prototype.attachUA = function(options) {
  options.headers["User-Agent"] = "ZendeskSync";
}

// Global Utilities
function getBaseOptions(credentials) {
    var auth = "Basic " + new Buffer(credentials.username + ":" + credentials.password).toString("base64");
    var options = {
      json: true,
      headers : {
        "Authorization" : auth
      }
    }
    return options;
}

function getGithubIssue(custom_fields) {
  var matches = custom_fields.filter(function (cf) {
    return cf.id === zendeskCredentials.githubField;
  });

  if (matches.length === 1) {
    return matches[0].value;
  } else {
    return -1;
  }
}

function isConfiguredProperly() {
  return (zendeskCredentials.username !== undefined &&
      zendeskCredentials.password !== undefined &&
      zendeskCredentials.domain !== undefined &&
      zendeskCredentials.githubField !== NaN &&
      githubCredentials.username !== undefined &&
      githubCredentials.password !== undefined &&
      githubCredentials.repo !== undefined)
}
