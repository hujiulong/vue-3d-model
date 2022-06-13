---
lang: en-US
permalink: /en/guide/installation
---

# Installation

## Using Package Manager
We recommend using the package manager (NPM, [Yarn](https://yarnpkg.com/), [PNPM](https://pnpm.io/)) to install Vue 3D Model.

With NPM:
```bash
npm install vue-3d-model --save
```

With Yarn:
```bash
yarn add vue-3d-model
```

With PNPM:
```bash
pnpm install vue-3d-model
```

If you are in a bad network environment, you can try other registries and tools like [CNPM](https://github.com/cnpm/cnpm).

## Import in Browser
Add `script` tag in your browser and use the global variable `Vue3DModel`.

### unpkg
```html
<head>
  <!-- Import Vue 3 -->
  <script src="//unpkg.com/vue@next"></script>
  <!-- Import component library -->
  <script src="//unpkg.com/vue-3d-model"></script>
</head>
```

### jsDelivr
```html
<head>
  <!-- Import Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@next"></script>
  <!-- Import component library -->
  <script src="//cdn.jsdelivr.net/npm/vue-3d-model"></script>
</head>
```
