'use strict';
/*
 *  ZendeskController: definition of controller for zendesk trigger listener
 */
import resourceHandler from './utils';
import ZendeskAPIClient from '../apiClients/ZendeskAPIClient';
import GithubAPIClient from '../apiClients/GithubAPIClient';


export default class ZendeskController {

	doGet() {
		return resourceHandler((context, req) => {
			let zendeskClient = new ZendeskAPIClient(context.data.ZENDESK_USERNAME,
				context.data.ZENDESK_PASSWORD, context.data.ZENDESK_DOMAIN, Number(context.data.ZENDESK_GITHUB_FIELD_ID));
      let githubClient = new GithubAPIClient(context.data.GITHUB_USERNAME,
				context.data.GITHUB_PASSWORD, context.data.GITHUB_REPO);
      let ticketId = req.query.ticket;
      let ticket, customFields;
      return zendeskClient.getTicket(ticketId)
      .then( json => {
        ticket = json.ticket;
        customFields = json.ticket.custom_fields;
        return zendeskClient.getComments(ticketId);
      }).then( json => {
        var githubIssue = zendeskClient.getGithubIssue(customFields);
        if (githubIssue > 0) {
          return githubClient.updateTicket(githubIssue, ticket, json);
        } else {
          return githubClient.createTicket(ticket, json);
        }
      }).then( json => zendeskClient.updateGithubIssue(ticketId, json.number, customFields))
				.then( json => {return {"ok": true}});
    });
	}
}
