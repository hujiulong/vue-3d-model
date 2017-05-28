# vue-3d-model
vue.js 3D model viewer component, based on three.js

## Example
[示例页面DEMO](https://hujiulong.github.io/vue-3d-model/#/demo-basic)

## Install
using npm
```
npm install vue-3d-model --save
```
Or using script tag for global use
```html
<script type="text/javascript" src="vue-3d-model.min.js"></script>
```

## Usage
```vue
<template>
    <model-obj src="example/models/obj/LeePerrySmith.obj"></model-obj>
</template>
<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        components: { ModelObj }
    }
</script>
```

## Browser Support
Modern browsers and IE 11.