var request = require('request-promise');

import BaseAPIClient from './BaseAPIClient'

export default class GithubAPIClient extends BaseAPIClient{

  constructor(username, password, repo) {
    //issues is added to the base because we are interested only in the resource issues
    super(username, password, 'https://api.github.com/repos/' + repo + '/issues');
  }

  buildJsonAndSecureOptions() {
    let opts = super.buildJsonAndSecureOptions();
    opts.headers["User-Agent"] = "ZendeskSync";
    return opts;
  }
  createTicket(ticket, commentsJson) {
    let options = this.buildJsonAndSecureOptions();
    options.method = "POST";
    options.body = {
      title: "[ZendeskId:" + ticket.id + "]:" + ticket.subject,
      body: this.buildBody(ticket, commentsJson),
      labels: ["SupportEscalation"]
    };
    options.uri = this.baseUri;
    return request(options);
  }

  updateTicket(issueId, ticket, commentsJson) {
    let options = this.buildJsonAndSecureOptions();
    options.method = "PATCH";
    options.body = {
      title: "[ZendeskId:" + ticket.id + "]:" + ticket.subject,
      body: this.buildBody(ticket, commentsJson)
    };
    options.uri = this.baseUri + "/" + issueId;
    return request(options);
  }

  buildBody(ticket, commentsJson) {
    let users = this.getUsers(commentsJson.users);
    let commentSummary = '* Ticket ID: **' + ticket.id + '** \r\n';
    commentSummary += '* Ticket Status: **' + ticket.status +'**\r\n';
    if (ticket.priority !== null) {
      commentSummary += '* Ticket Priority: **' + ticket.priority +'**\r\n';
    }
    if (ticket.type !== null) {
      commentSummary += '* Ticket Type: **' + ticket.type +'**\r\n';
    }
    commentSummary += '\r\n';
    commentsJson.comments.forEach((comment) => {
      commentSummary += "### Time Created: " + comment.created_at + "\r\n";
      if (comment.updated_at !== undefined) {
        commentSummary += "### Time Updated: " + comment.updated_at + "\r\n";
      }
      if (users[comment.author_id].photo !== null) {
        commentSummary += "![](" + users[comment.author_id].photo.content_url
                          + ")" + "\r\n";
      }

      commentSummary += "**Name** " + users[comment.author_id].name + "\r\n";

      if (comment.public) {
        commentSummary += "**Comment** " + comment.body + "\r\n";
      } else {
        commentSummary += "**Internal Comment** " + comment.body + "\r\n";
      }

    });
    return commentSummary;
  }

  getUsers(users) {
    let usersObj = {};
    users.forEach( user => { usersObj[user.id] = user} );
    return usersObj;
  }
}
