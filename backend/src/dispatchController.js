const scrapRoute = require("./scrapper").default;
const CONFIG = require("./config");

module.exports.default = async (req, res) => {
    const {serverCode, post} = req.params;

    if (!CONFIG.SERVERS.includes(serverCode) || !CONFIG.POSTS[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${serverCode} ${post}`);
    const [data, error] = await scrapRoute(res, serverCode, post);
    if (!error)
        res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send(data)
}