const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/images"
        ],
        target: "http://localhost:2222/",
        secure: false,
        "changeOrigin": true
    }
]
module.exports = PROXY_CONFIG;