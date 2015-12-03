var request = require('request-promise');

import BaseAPIClient from './BaseAPIClient'

export default class ZendeskAPIClient extends BaseAPIClient {

  constructor(username, password, domain, githubField) {
    super(username, password, 'https://'+ domain +'.zendesk.com/api/v2/');
    this.githubField = githubField;
  }
  updateTicketTag(ticketId) {
    let options = super.buildJsonAndSecureOptions();
    options.method = "PUT";
    options.uri = this.baseUri + "tickets/" + ticketId + "/tags.json";
    options.body = {
        tags: ["github-closed"]
    };
    return request(options);
  }

  updateTicketComment(ticketId) {
    let options = super.buildJsonAndSecureOptions();
    options.method = "PUT";
    options.uri = this.baseUri + "tickets/" + ticketId + ".json";
    options.body = {
      ticket: {
        comment: {
          public: false,
          body: "This ticket was closed in Github, tag was added."
        }
      }
    };
    return request(options);
  }

  getTicket(ticketId) {
    let options = super.buildJsonAndSecureOptions();
    options.method = "GET";
    options.uri = this.baseUri + "tickets/" + ticketId + ".json";
    return request(options);
  }

  updateGithubIssue(ticketId, githubIssueId, customFields) {
    let needsUpdate = false;
    customFields.forEach(custom => {
      if (custom.id === this.githubField) {
        needsUpdate = true;
        custom.value = githubIssueId;
      }
    });
    if (needsUpdate) {
      var options = this.buildJsonAndSecureOptions();
      options.method = "PUT";
      options.uri = this.baseUri + "tickets/" + ticketId + ".json";
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

  getComments(ticketId) {
    var options = super.buildJsonAndSecureOptions();
    options.method = "GET";
    options.uri = this.baseUri + "tickets/" + ticketId + "/comments.json?include=users&sort_order=desc";
    return request(options);
  }

  getGithubIssue(custom_fields) {
    let matches = custom_fields.filter(cf => {
      return cf.id === this.githubField && cf.value !== ''
        && cf.value !== null;
    });

    if (matches.length === 1) {
      return matches[0].value;
    } else {
      return -1;
    }
  }

}
