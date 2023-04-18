<template>
<router-view></router-view>
</template>

<script>
export default {
  methods: {
    initializeLayout() {
      if (!this.$rtl.isRTL) {
        // Just make sure rtl css is off when we are not on rtl
        this.$rtl.disableRTL();
      }
    }
  },
  mounted() {
    this.initializeLayout();
    let tradingViewScripts = document.createElement('script')
    tradingViewScripts.setAttribute('src', 'https://s3.tradingview.com/tv.js')
    document.head.appendChild(tradingViewScripts)
  }
};

</script>
<style src='../node_modules/@sweetalert2/theme-dark/dark.min.css'></style>
FOOTER HERE