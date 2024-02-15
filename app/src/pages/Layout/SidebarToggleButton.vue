<template>
  <el-tooltip
      content="Open Navigation"
      effect="light"
      :open-delay="300"
      placement="right"
  >

    <img class="logoImage" @click="minimizeSidebar" v-bind:src="logo" alt="logo"
         style="height: 52px;position: relative;left: -35px;"/>
  </el-tooltip>
</template>
<script>
export default {
  name: 'sidebar-toggle-button',
  data: () => ({
    logo: 'img/icons/maybe_logo.png'
  }),
  methods: {
    minimizeSidebar() {
      // Remove this code if you don't want to display notifications while minimizing sidebar
      let isMinimizedText = this.$sidebar.isMinimized
          ? 'deactivated'
          : 'activated';
      // this.$notify({
      //   type: 'primary',
      //   message: `Sidebar mini ${isMinimizedText}...`,
      //   icon: 'tim-icons icon-bell-55'
      // });
      console.log(`Sidebar mini ${isMinimizedText}...`)
      this.$sidebar.toggleMinimize();
    }
  }
};
</script>
<style>
@media (max-width: 992px) {
  .logoImage {
    display: none;
  }
}

</style>
