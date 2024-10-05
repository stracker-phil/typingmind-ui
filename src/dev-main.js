import config from './lib/config';
import Asset from './lib/asset';

/**
 * This script is the main entry point during development.
 * Its only purpose is to load the extension's `main.js` script
 * using a timestamped URL to bypass caching.
 *
 * For production environments, this script should not be used.
 */
const devAsset = new Asset('dev-main', config.origin);
devAsset.script = `main.js?t=${Date.now()}`;
devAsset.load();
