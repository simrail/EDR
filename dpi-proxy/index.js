const httpProxy = require('http-proxy');
httpProxy.createProxyServer({target: "https://edr.deadlykungfu.ninja?betaToken=SzdW1"}).listen(8090);
