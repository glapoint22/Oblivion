const PROXY_CONFIG = [
    {
        context: [
            "/images"
        ],
        target: "http://localhost:2112/",
        secure: false,
        changeOrigin: false
    },
    {
        context: [
            "/api",
            "/images"
        ],
        target: "http://localhost:5150/",
        secure: false,
        changeOrigin: false
    }
    
]
module.exports = PROXY_CONFIG;