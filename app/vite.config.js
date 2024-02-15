import {defineConfig} from 'vite'
import {createVuePlugin} from 'vite-plugin-vue2'

export default defineConfig({
    plugins: [createVuePlugin()],
    server: {
        port: 8080,
    },
    pwa: {
        name: 'StockTradingJournal',
        themeColor: '#344675',
        msTileColor: '#344675',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: '#344675'
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
})
