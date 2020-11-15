# 十九周｜发布系统

## 1. 持续集成｜发布前检查的相关知识

客户端的持续集成：

- Daily Build
- BVT build verification test，一般由测试工程师提供。

前端的持续集成：

- 由于前端的 build 速度很快，所以周期 build 可以缩短时间。
- 由于测试工程师产生 BVT case 的成本高，因而对于快节奏的前端开发来说，BVT 的应用有限，转而使用更轻量级的校验，比如 lint，如果要使用重量级的测试可以使用 PhantomJS、Chrome Headless 这样的无头浏览器。

## 2. 持续集成｜Git Hooks 基本用法

用于在 git 的各生命周期进行操作。

[参考文档](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

## 3. 持续集成｜ESLint 基本用法

[https://eslint.org/](https://eslint.org/)

## 4. 持续集成｜ESLint API 及其高级用法

同上，见文档。

## 5. 持续集成｜使用无头浏览器检查 DOM

[参考文档](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)

[puppeteer](https://github.com/puppeteer/puppeteer)