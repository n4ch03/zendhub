'use strict';
/*
 *  GithubController: definition of controller for github webhook listener
 */
import resourceHandler from './utils'
import bluebird from 'bluebird'

export default class GithubController {

	post() {
		return resourceHandler((context, req) => {
			console.log(context);
      return bluebird.resolve({"message": "topu Github"});
    });
	}
}
