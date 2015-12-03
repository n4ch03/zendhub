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
     if (req.webtaskContext.data.ZENDESK_USERNAME !== undefined &&
         req.webtaskContext.data.ZENDESK_PASSWORD !== undefined &&
         req.webtaskContext.data.ZENDESK_DOMAIN !== undefined &&
         req.webtaskContext.data.ZENDESK_GITHUB_FIELD_ID !== undefined &&
         req.webtaskContext.data.GITHUB_USERNAME !== undefined &&
         req.webtaskContext.data.GITHUB_PASSWORD !== undefined &&
         req.webtaskContext.data.GITHUB_REPO !== undefined) {
        next();
      } else {
        res.status(412).json({"ok": false, "error": "Missing Webtask configuration parameter"});
      }

   });
 	 return middlewares;
 }
