---
lang: zh-CN
permalink: /zh/guide/installation
---

# 安装

## 使用包管理器
我们推荐您使用包管理器(NPM, [Yarn](https://yarnpkg.com/), [PNPM](https://pnpm.io/))安装 Vue 3D Model。

使用 NPM:
```bash
npm install vue-3d-model --save
```

使用 Yarn:
```bash
yarn add vue-3d-model
```

使用 PNPM:
```bash
pnpm install vue-3d-model
```

如果您的网络环境不好，推荐使用[CNPM](https://github.com/cnpm/cnpm).

## 浏览器引入
在浏览器中使用 `script` 标签直接引入文件，并使用全局变量 `Vue3DModel`。

### unpkg
```html
<head>
  <!-- 引入 Vue 3 -->
  <script src="//unpkg.com/vue@next"></script>
  <!-- 引入组件库 -->
  <script src="//unpkg.com/vue-3d-model"></script>
</head>
```

### jsDelivr
```html
<head>
  <!-- 引入 Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@next"></script>
  <!-- 引入组件库 -->
  <script src="//cdn.jsdelivr.net/npm/vue-3d-model"></script>
</head>
```
