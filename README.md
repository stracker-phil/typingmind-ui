# Typing Mind UI extension

## Development

```
# Set up the dev environment
npm install
```

### Start local development

The local webserver is ideal for development, as changes can be tested without uploading or
committing anything. However, the TypingMind app cannot access the localhost without a proxy (below)

The `start` command starts a file watcher and serves the latest compiled assets of the project:

```sh
# Start local webserver
npm run start
```

The locally served script is available at [localhost:9000/dev-main.js](http://localhost:9000/dev-main.js)

**Proxy for TypingMind**

I suggest using `cloudflared` for this

- URL: https://one.dash.cloudflare.com
- Install the `cloudflared` service on your development machine
- Create a new tunnel to your machine
- Expose the webpack dev server using a public hostname

When the tunnel is working, add the `dev-main.js` script as a Typing Mind extension.

- Tunnel: `https://your-tunnel.domain.tld` → `http://localhost:9000`
- Extension URL: `https://your-tunnel.domain.tld/dev-main.js`

**Why is there a "dev-main.js"?**

Both, Typing Mind and Cloudflare implement a cache that can cause extensions to be out of date. For development, we need to disable caching, which is the _only_ thing that `dev-main.js` is doing.
