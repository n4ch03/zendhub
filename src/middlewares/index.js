'use strict';
/*
 *  Middlewares: define all global middlewares for your api
 */
 import express    from 'express';
 import bodyParser from 'body-parser';

 export default () => {
   let middlewares = express.Router();
   middlewares.use(bodyParser.json()); // for parsing application/json
   middlewares.use((req, res, next) => {
     if (req.webtaskContext.ZENDESK_USERNAME !== undefined &&
         req.webtaskContext.ZENDESK_PASSWORD !== undefined &&
         req.webtaskContext.ZENDESK_DOMAIN !== undefined &&
         req.webtaskContext.ZENDESK_GITHUB_FIELD_ID !== undefined &&
         req.webtaskContext.GITHUB_USERNAME !== undefined &&
         req.webtaskContext.GITHUB_PASSWORD !== undefined &&
         req.webtaskContext.GITHUB_REPO !== undefined) {
        next();
      } else {
        res.status(412).json({"ok": false, "error": "Missing Webtask configuration parameter"});
      }

   });
 	 return middlewares;
 }
