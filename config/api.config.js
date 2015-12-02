'use strict';
import _             from 'lodash'
import defaultConfig from './default.config.js'
/*
 *  Boilerplate: This configuration file will be injected (merged with the default configuration) when running the api locally
 *
 *  All secrets should go under the `secret` section, the rest of configuration params should go under `params`
 *
 */
let config = {
  localPort: 8080,
  secret:    {
  },
  param:     {
  }
};

export default () => (_.merge(defaultConfig(), config));
