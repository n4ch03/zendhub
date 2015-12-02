'use strict';
/*
 *  Route handler for Todos microservice
 */
import express        from 'express';
import GithubController from '../controllers/GithubController';

export default () => {
  let route      = express.Router();
  let controller = new GithubController();

  route.post  ('/',    controller.post());
  return route;
}
