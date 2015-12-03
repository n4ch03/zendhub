'use strict';
/*
 *  Route handler for Todos microservice
 */
import express        from 'express';
import ZendeskController from '../controllers/ZendeskController';

export default () => {
  let route      = express.Router();
  let controller = new ZendeskController();

  route.get  ('/',    controller.doGet());

  return route;
}
