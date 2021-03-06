// More info on Webpack's Node API here: https://webpack.js.org/api/node/
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */
import checkVersion from './checkVersion';
import webpack from 'webpack';
import config from '../webpack.config.prod';
import {chalkError, chalkSuccess, chalkWarning, chalkProcessing} from './chalkConfig';

checkVersion();

process.env.NODE_ENV = 'production'; // this assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log(chalkProcessing('Generating minified bundle. This will take a moment...'));
webpack(config).run((error, stats) => {
  if (error) { // so a fatal error occurred. Stop here.
    console.log(chalkError(error));
    process.exit(1);
  }

  const jsonStats = stats.toJson();

  if (jsonStats.errors.length > 0) {
    console.log(chalkWarning('Webpack generated the following errors: '));
    jsonStats.errors.map(error => console.log(chalkError(error)));
    process.exit(1);
  }

  if (jsonStats.warnings.length > 0) {
    console.log(chalkWarning('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(chalkWarning(warning)));
  }

  console.log(chalkSuccess('Your app is compiled in production mode in /dist. It\'s ready to roll!'));

  process.exit(0);
});
