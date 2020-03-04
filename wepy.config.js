const path = require('path')
var prod = process.env.NODE_ENV === 'production'

module.exports = {
  wpyExt: '.vue',
  eslint: true,
  cliLogs: !prod,
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    modules: ['node_modules']
  },
  compilers: {
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions'
      ]
    }
  },
  plugins: {}
}

if (prod) {
  // 压缩sass
  module.exports.compilers['sass'] = { outputStyle: 'compressed' }

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {}
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
