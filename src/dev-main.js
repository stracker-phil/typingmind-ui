import config from './lib/Config';
import Asset from './lib/Asset';

/**
 * This script is the main entry point during development.
 * Its only purpose is to load the extension's `main.js` script
 * using a timestamped URL to bypass caching.
 *
 * For production environments, this script should not be used.
 */
Asset.bypassCache(true)
const devAsset = new Asset('dev-main', config.origin);
devAsset.script = 'main.js';
devAsset.load();
