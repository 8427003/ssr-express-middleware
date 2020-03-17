const path = require('path');
const stats = require('@sukbta/ssr-stats-data-helper');

module.exports = function ({ root } = {}) {
    const initedStats = stats.initStats(require(path.resolve(root, 'stats.json')));
    const htmlTpl = stats.makeHtmlTpl(path.resolve(root, 'index.html'));
    const SSR_APP = stats.requireAll(initedStats, root);

    return async function (req, res, next) {
        console.log('===========backend entry===========')
        const matchResult = await SSR_APP.loadReady(req.path);

        console.log('===========backend send ===========')
        try {
            const pageContent = SSR_APP.ReactDOMServer.renderToString(
                SSR_APP.React.createElement(SSR_APP.App, { routerProps: {location: req.path} })
            );

            res.send(stats.getIndexHtml({ htmlTpl, matchResult, pageContent, initedStats }));
        }
        catch(e) {
            console.error(e);
        }
        console.log('===========backend end===========')
        next();
    }
}
