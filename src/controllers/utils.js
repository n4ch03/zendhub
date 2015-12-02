'use strict'
/*
 *  resourceHandler: maps a promise based handler into an express handler
 */
export default function resourceHandler(handler, successStatusCode = 200) {
  return (req, res) => {
    handler(req.webtaskContext, req, res)
      .then (response => res.status(successStatusCode) .json(response))
      .catch(error    => res.status(error.status || 500).json({error: error}))
    ;
  }
}


