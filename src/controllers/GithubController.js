'use strict';
/*
 *  GithubController: definition of controller for github webhook listener
 */
import resourceHandler from './utils'
import ZendeskAPIClient from '../apiClients/ZendeskAPIClient'

export default class GithubController {

	doPost() {
		return resourceHandler((context, req) => {
			let re = /\[ZendeskId:(.*)\]/m;
			let title = req.body.issue.title;
			let zendeskTicketID;

			if (req.body.action === 'closed' && re.test(title)) {
				zendeskTicketID = title.match(re)[1];
				let zendeskClient = new ZendeskAPIClient(context.data.ZENDESK_USERNAME,
					context.data.ZENDESK_PASSWORD, context.data.ZENDESK_DOMAIN, Number(context.data.ZENDESK_GITHUB_FIELD_ID));

				return zendeskClient.updateTicketTag(zendeskTicketID)
					.then( json => zendeskClient.updateTicketComment(zendeskTicketID))
					.then( json => {return {"ok": true}});
			} else {
				return {"ok": true};
			}
    });
	}
}
