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

```
# Start local webserver
npm run start
```

The local server is available at [localhost:9000/main.js](http://localhost:9000/main.js)

**Proxy for TypingMind**

I suggest using `cloudflared` for this

- URL: https://one.dash.cloudflare.com
- Install the `cloudflared` service on your development machine
- Create a new tunnel to your machine
- Expose the webpack dev server using a public hostname

When the tunnel is working, add the `main.js` script as a Typing Mind extension.

- Tunnel: `https://your-tunnel.domain.tld` → `http://localhost:9000`
- Extension URL: `https://your-tunnel.domain.tld/main.js`
