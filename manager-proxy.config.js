const PROXY_CONFIG = [
    {
        context: [
            "/website-images"
        ],
        target: "http://localhost:2112/",
        secure: false,
        changeOrigin: false,
        "pathRewrite": {
            "^/website-images": "/images"
          }
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