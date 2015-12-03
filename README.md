# zendhub: integration webhooks between Zendesk & Github Issues

## Roadmap / Next Steps

* Add Tests
* Document better the process of work with state machine and brainstorm regarding other state change triggers

## Motivation

In some cases have in sync tickets from Support and Development are a pain :

* Duplicated information in Support and Development tickets(usually different software).
* Once Development ticket is created in most of cases some context could be lost b/c support attach information to Support Ticket but Development Ticket will not be updated and for developer’s life, the ticket reported in the tool used by dev is the source of truth.
* When the ticket is resolved in development there is no automatic action taken in the Support software. Support software is the source of truth for the Support Guys.
* This repo aims to solve the problem when tool for Support is **Zendesk** and tool for dev is **Github**, if tickets aren’t updated in both sides there is miscommunication. Maybe this situation is not important in few ticket, or few projects but when you start to escalate you’ll start having tons of “case” open and the perception of the quality and response time could be bad even when that is not the case.


## Implemented Solution

### The Support Guy Life.

**What I expect as a support guy team?**
1. When a ticket is created and when I as a support team member create a ticket, a counterpart ticket is created only if the tag **escalate** is applied.
Basic information want to “attach” to github issue is: **subject**, **description**, **ticket id**, **type**, **priority**, **status** and **all public and internal comments**. **File attachements aren't covered in this version of the integration**.
2. If any of the tracked fields in **Zendesk** are updated the **Github** issue must be updated.
3. As a support team member I wouldn’t have to go frequently to github to check the ticket status or asking several times a day to dev how the issue is looking, so as a final requirement from support side I would love that ticket tags has **if Github issue is closed**.
4. Do not want automatically closing issues by webhooks, Github issues should be closed by Devs, Zendesk tickets must be closed by Support team.

### The Developer Life.
As a developer I don’t want new github issues due to Zendesk ticket:) But when happens I really would love to have the following things that makes my life easy:

1. Github issue created automatically with the contents of the Zendesk ticket, don’t want to go to the ticket in zendesk. **Only restriction for this version of the integration is for files**.
2. Want a label: **SupportEscalation** applied to the issue
3. Any change in Zendesk ticket must be present in Github issue.
4. Closing issue in Github must add a tag in Zendesk with the tag **github-closed**
5. If the Zendesk ticket state goes to solved I really want that information in the Github Issue. Do not want automatically closing my issue, Github issues should be closed by Devs, Zendesk tickets must be closed by Support team.



## Installation Instructions

**Hooks to attend Zendesk/Github events ([Webtask](http://webtask.io/))**

Before start, get all the node modules
```
npm install
```

### Create your webtask profile and configure `./config/webtask.config.js`

```
wt init
wt profile get default
```

Edit the file and provide token and [Webtask](http://webtask.io/) name, for example `zendhub`

```
let config = {
 webtaskName:  'zendhub',
 webtaskToken: 'THE_TOKEN', // your webtask token goes here, install wt-cli then run wt init and finally wt profile get default

 secret:       {
 },
 param:        {
 }
};
```

### API access and other configurations parameters

Edit the file default.config.js to set up API credentials for `Github` and `Zendesk`

```
export default () => {
  return {
    baseUri: '/api', //base Path for API
    // Secrets
    secret: {
      ZENDESK_USERNAME: "ZendeskUsername/Email",
      ZENDESK_PASSWORD: "Zendesk Password",
      ZENDESK_DOMAIN: "Zendesk Domain ",
      ZENDESK_GITHUB_FIELD_ID: "Zendesk Custom Field ID",
      // Field created to store github issue Id
      GITHUB_USERNAME: "GithubUsername",
      GITHUB_PASSWORD: "GithubPassword",
      GITHUB_REPO: "Github Repo" //ie /n4ch03/sample-repo
    },
    // Configuration parameters
    param:  {
    }
  };
}
```

### [Webtask](http://webtask.io/) Deployment
```
gulp deployWebtask
```

This task will have as output the url where the API is listening. We are interested in the following urls:

* GET https://webtask.it.auth0.com/api/run/YOUR_CONTAINER/zendhub/api/zendesk (Use this for Zendesk Target)
* POST https://webtask.it.auth0.com/api/run/YOUR_CONTAINER/zendhub/api/github (Use this for Github Webhook)

### Create a Zendesk Target
In the following video you can see how to define a Zendesk [Target](https://support.zendesk.com/hc/en-us/articles/203662136-Notifying-external-targets)

The idea here is set up the endpoint that will be listen when a ticket is created in **Zendesk**. The only must have thing is to define the parameter sent to the endpoint with the attribute name: **ticket**.


![](https://dl.dropboxusercontent.com/u/3835331/zendhub-createTarget.gif)

### Create a Zendesk Trigger
In the following video you can observe how to set up a trigger in **Zendesk**. In this case we want to trigger a POST to our endpoint when:
* a ticket is created with a user different than the one we tied with the webtask
* a ticket is updated with a user different than the one we tied with the webtask
* If the tag **escalate** is not present in the ticket no action will be made

We need to provide to the action message the placeholder **{{ticket.id}}**

![](https://dl.dropboxusercontent.com/u/3835331/zendhub-createTrigger.gif)

### Create a Github Webhook
In the following video you can watch how to set up a webhook to our second webtask which will be listen when a Github Issue is closed to update Zendesk ticket.

![](https://dl.dropboxusercontent.com/u/3835331/zendhub-createWebhook.gif)

### Watch It in Action

![](https://dl.dropboxusercontent.com/u/3835331/zendhub-inaction.gif)
