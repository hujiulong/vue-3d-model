import { defineUserConfig } from 'vuepress';
import { defaultTheme } from '@vuepress/theme-default';
import path from 'path';

const isDevMode = process.env.NODE_ENV === 'development';

export default defineUserConfig({
  title: 'Vue 3D Model',
  description: 'Vue 3D Model',
  alias: {
    'vue-3d-model': isDevMode ? path.resolve(__dirname, '../../src') : path.resolve(__dirname, '../../dist/vue-3d-model.esm.js'),
    'docs': path.resolve(__dirname, '../../docs'),
  },
  locales: {
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vue 3D Model',
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vue 3D Model',
    },
  },
  theme: defaultTheme({
    home: '/en/guide/installation',
    navbar: [
      {
        text: 'GitHub',
        link: 'https://github.com/hujiulong/vue-3d-model'
      }
    ],
    locales: {
      '/zh/': {
        selectLanguageName: '简体中文',
        home: '/zh/guide/installation',
        sidebar: [
          {
            text: '指南',
            children: [
              '/guide/installation.zh-CN.md',
              '/guide/getting-started.zh-CN.md',
              '/guide/api.zh-CN.md',
            ]
          },
          {
            text: '示例',
            children: [
              '/examples/example-basic.zh-CN.md',
              '/examples/example-background.zh-CN.md',
              '/examples/example-controls.zh-CN.md',
              '/examples/example-rotate.zh-CN.md',
              '/examples/example-snapshot.zh-CN.md',
              '/examples/example-event.zh-CN.md',
              '/examples/example-fbx.zh-CN.md',
              '/examples/example-gltf.zh-CN.md',
              '/examples/example-json.zh-CN.md',
              '/examples/example-obj.zh-CN.md',
              '/examples/example-obj-mtl.zh-CN.md',
              '/examples/example-ply.zh-CN.md',
              '/examples/example-stl.zh-CN.md',
            ]
          }
        ]
      },
      '/en/': {
        selectLanguageName: 'English',
        home: '/en/guide/installation',
        sidebar: [
          {
            text: 'Guide',
            children: [
              '/guide/installation.en-US.md',
              '/guide/getting-started.en-US.md',
              '/guide/api.en-US.md',
            ]
          },
          {
            text: 'Examples',
            children: [
              '/examples/example-basic.en-US.md',
              '/examples/example-background.en-US.md',
              '/examples/example-controls.en-US.md',
              '/examples/example-rotate.en-US.md',
              '/examples/example-snapshot.en-US.md',
              '/examples/example-event.en-US.md',
              '/examples/example-fbx.en-US.md',
              '/examples/example-gltf.en-US.md',
              '/examples/example-json.en-US.md',
              '/examples/example-obj.en-US.md',
              '/examples/example-obj-mtl.en-US.md',
              '/examples/example-ply.en-US.md',
              '/examples/example-stl.en-US.md',
            ]
          }
        ]
      },
    }
  })
})
