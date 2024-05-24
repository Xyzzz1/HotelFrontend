
const back_end_ip= '172.20.10.3'

module.exports = {
  "publicPath": "./",
  "outputDir": "dist",
  "assetsDir": "static",
  "indexPath": "index.html",
  "filenameHashing": true,
  "pages": {
    "index": {
      "entry": "src/main.js",
      "template": "public/index.html",
      "filename": "index.html",
      "title": "Index Page",
      "chunks": [
        "chunk-vendors",
        "chunk-common",
        "index"
      ]
    }
  },
  "lintOnSave": true,
  "runtimeCompiler": false,
  "transpileDependencies": [
    "vuetify"
  ],
  "productionSourceMap": true,
  "crossorigin": "",
  "integrity": false,
  "devServer": {
    "open": false,
    "host": "0.0.0.0",
    "port": 9153,
    "https": false,
    "hotOnly": false,
    "proxy": {
      "/user": {
        "target": `http://${back_end_ip}:9151/user`,
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/api": ""
        }
      },
      "/admin": {
        "target": `http://${back_end_ip}:9151/admin`,
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/api": ""
        }
      },
      "/reception": {
        "target": `http://${back_end_ip}:9151/reception`,
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/api": ""
        }
      },
    }
  },
  "css": {
    "sourceMap": false,
    "loaderOptions": {
      "css": {},
      "postcss": {}
    },
    "modules": false
  },
  "parallel": true,
  "pwa": {},
  "pluginOptions": {}
}