'use strict';
/*
 *  ZendeskController: definition of controller for zendesk trigger listener
 */
import resourceHandler from './utils';
import ZendeskAPIClient from '../apiClients/ZendeskAPIClient';
import GithubAPIClient from '../apiClients/GithubAPIClient';


export default class ZendeskController {

	post() {
		return resourceHandler((context, req) => {
			//TODO: Create a Middleware to validate this :)
			/*if (!isConfiguredProperly()) {
        return cb(409, {"message": "Sorry your webtask does not have " +
          "all the parameters configured correctly please check README"});
      }*/
			let zendeskClient = new ZendeskAPIClient(context.data.ZENDESK_USERNAME,
				context.data.ZENDESK_PASSWORD, context.data.ZENDESK_DOMAIN, Number(context.data.ZENDESK_GITHUB_FIELD_ID));
      let githubClient = new GithubAPIClient(context.data.GITHUB_USERNAME,
				context.data.GITHUB_PASSWORD, context.data.GITHUB_REPO);
      let ticketId = req.query.ticket;
      let ticket, customFields;
      return zendeskClient.getTicket(ticketId)
      .then(function(json) {
        ticket = json.ticket;
        customFields = json.ticket.custom_fields;
        return zendeskClient.getComments(ticketId);
      }).then(function (json) {
        var githubIssue = zendeskClient.getGithubIssue(customFields);
        if (githubIssue > 0) {
          return githubClient.updateTicket(githubIssue, ticket, json);
        } else {
          return githubClient.createTicket(ticket, json);
        }
      }).then(function (json) {
        return zendeskClient.updateGithubIssue(ticketId, json.number, customFields);
      }).then(function (json) {
        return {"ok": true};
      });
    });
	}
}
