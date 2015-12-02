'use strict';
/*
 *  Middlewares: define all global middlewares for your api
 */
 import express    from 'express';
 import bodyParser from 'body-parser';

 export default () => {
   let middlewares = express.Router();
   middlewares.use(bodyParser.json());                         // for parsing application/json
 	 return middlewares;
 }
