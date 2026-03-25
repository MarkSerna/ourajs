// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme';
import OuraSyncLocale from '../../components/OuraSyncLocale.vue';
import OuraDemo from '../../components/OuraDemo.vue';
import './custom.css';
import { h } from 'vue';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(OuraSyncLocale),
    });
  },
  enhanceApp({ app }: any) {
    app.component('OuraDemo', OuraDemo);
  },
};
