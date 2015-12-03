'use strict';
import _             from 'lodash'
import defaultConfig from './default.config.js'
/*
 *  Boilerplate: This configuration file will be sent to the Webstask runtime (merged with the default configuration) when creating the webtask
 *
 *  All secrets should go under the `secret` section, the rest of configuration params should go under `params`
 *
 */
let config = {
  webtaskName:  'zendhub',
  webtaskToken: 'TOKEN', // your webtask token goes here, install wt-cli then run wt init and finally wt profile get default

  secret:       {
  },
  param:        {
  }
};

export default () => (_.merge(defaultConfig(), config));
