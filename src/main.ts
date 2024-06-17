import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// element-plus引入配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// element-plus-icon引入配置
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// element-plus注册
app.use(ElementPlus)

// element-plus-icon注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
