# 十六周｜工具链

## 1. 初始化与构建｜初始化工具 Yeoman（一）

[yeoman.io](https://yeoman.io/authoring/index.html)

Yeoman 的安装，见其文档。

## 2. 初始化与构建｜初始化工具 Yeoman（二）

Yeoman 的文件系统和依赖系统，见其文档。

## 3. 初始化与构建｜初始化工具 Yeoman（三）

编写一个 generator-vue，在 vue-demo 中生成 vue 工程脚手架。

因为 webpack 5 有无法解决的问题，所以指定了 webpack 4。

```javascript
this.npmInstall(["webpack@4", { 'save-dev': true })
```

## 4. 初始化与构建｜Webpack 基本知识

1. 推荐 npx
2. webpack，见其[文档](https://webpack.js.org/concepts/) 

## 5. 初始化与构建｜Babel 基本知识

babel，见其[文档](https://babeljs.io/docs/en/)