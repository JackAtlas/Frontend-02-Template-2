var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  async initPackage() {
    let answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])

    const pkgJson = {
      'name': answer.name,
      'version': '1.0.0',
      'description': '',
      'main': 'index.js',
      'scripts': {
        'build': 'webpack',
        'coverage': 'nyc npm run test',
        'test': 'mocha --require @babel/register'
      },
      'author': '',
      'license': 'ISC'
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    this.npmInstall(['vue'], { 'save-dev': false })
    this.npmInstall(['webpack@4', 'vue-loader', 'vue-style-loader', 'babel-loader', 'css-loader', 'vue-template-compiler', 'copy-webpack-plugin', '@babel/core', '@babel/preset-env', '@babel/register', 'mocha', 'nyc', '@istanbuljs/nyc-config-babel', 'babel-plugin-istanbul'], { 'save-dev': true })

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {}
    )
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      {}
    )
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      {}
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    )
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: answer.name }
    )
    this.fs.copyTpl(
      this.templatePath('sample-test.js'),
      this.destinationPath('test/sample-test.js'),
      {}
    )
  }
}