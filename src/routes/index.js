'use strict';
/*
 *  Router: loads all api routes
 */
import express        from 'express';
import zendeskInstaller from './zendeskInstaller'
import githubInstaller from './githubInstaller'

export default () => {
  let routes = express.Router();

  routes.use('/github', githubInstaller());
  routes.use('/zendesk', zendeskInstaller());

	return routes;
}
