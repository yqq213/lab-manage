import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
// import px2rem from 'postcss-plugin-px2rem'
import autoprefixer from 'autoprefixer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // command: serve -> 开发环境   build -> 生产环境
  const env = loadEnv(mode, process.cwd())

  const isBuild = command === 'build'

  return {
    base: env.VITE_PUBLIC_PATH,
    server: {
      host: true,
      hmr: true,
      port: Number(env.VITE_PORT),
      // proxy: {
      //   '/attendance-admin': {
      //     target: env.VITE_PROXY_API_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/attendance-admin/, '')
      //   },
      // }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            // 自动添加前缀
            overrideBrowserslist: [
                'Android 4.1',
                'iOS 7.1',
                'Chrome > 31',
                'ff > 31',
                'ie >= 8',
                //'last 2 versions', // 所有主流浏览器最近2个版本
            ],
            grid: true,
          }),
          // px2rem({
          //   rootValue: 19.2, // 换算基数，表示1rem等于19.2px
          //   // unitPrecision: 5, // 允许REM单位增长到的十进制数字。
          //   //propWhiteList: [],  // 默认值是一个空数组，这意味着禁用白名单并启用所有属性。
          //   // propBlackList: [], // 黑名单
          //   exclude: /(node_module)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
          //   // selectorBlackList: [], // 要忽略并保留为px的选择器
          //   // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
          //   // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
          //   mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
          //   minPixelValue: 3, // 设置要替换的最小像素值(3px会被转rem)。 默认 0
          // })
        ],
      },
      preprocessorOptions: {  // less全局预处理器
        less: {
          javascriptEnabled: true,
          // modifyVars: {
          //   'primary-color': 'rgba(31, 145, 114)'
          // },
          additionalData: `@import "@/styles/variables.less";`
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      legacy({
        targets: ['chrome 52']
      }),
      createHtmlPlugin({
        minify: isBuild, // 是否压缩 HTML
        inject: {
          data: {
            title: env.VITE_GLOB_APP_TITLE,
          }
        }
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        // Specify symbolId format
        symbolId: 'svg-icon-[dir]-[name]',
      }),
      // 自动按需加载ant-design-vue
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          })
        ]
      })
    ]
  }
}
