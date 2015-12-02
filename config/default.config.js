'use strict';
/*
 *  Boilerplate: This configuration file will be merged with local/remote configurations during build/webtask creation
 *
 *  All secrets should go under the `secret` section, the rest of configuration params should go under `params`
 *
 */
export default () => {
  return {
    baseUri: '/api',
    // Secrets
    secret: {
      ZENDESK_USERNAME: "username",
      ZENDESK_PASSWORD: "password",
      ZENDESK_DOMAIN: "domain",
      ZENDESK_GITHUB_FIELD_ID: "field_id",
      GITHUB_USERNAME: "username",
      GITHUB_PASSWORD: "passwd",
      GITHUB_REPO: "repo"
    },
    // Configuration parameters
    param:  {
    }
  };
}
