const path = require('path');
const stats = require('@sukbta/ssr-stats-data-helper');

module.exports = function ({ root } = {}) {
    const initedStats = stats.initStats(require(path.resolve(root, 'stats.json')));
    const htmlTpl = stats.makeHtmlTpl(path.resolve(root, 'index.html'));
    const SSR_APP = stats.requireAll(initedStats, root);

    return async function (req, res, next) {
        console.log(`==========request: ${req.path}==========`)
        try {
            console.log('\n==========loadReady start==========');
            const matchResult = await SSR_APP.loadReady(req.path);
            console.log('==========loadReady end==========\n');

            if(matchResult) {
                const pageContent = SSR_APP.ReactDOMServer.renderToString(
                    SSR_APP.React.createElement(SSR_APP.App, { routerProps: {location: req.path} })
                );
                res.send(stats.getIndexHtml({ htmlTpl, matchResult, pageContent, initedStats }));
            }
        }
        catch(e) {
            console.error(e, 'error');
        }
        console.log('==========respose end==========')
        next();
    }
}

