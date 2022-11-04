const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/images"
        ],
        target: "http://localhost:2112/",
        secure: false,
        "changeOrigin": true
    }
]
module.exports = PROXY_CONFIG;