<template>
  <base-nav
      v-model="showMenu"
      class="navbar-absolute top-navbar"
      type="white"
      :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div class="navbar-minimize d-inline">
        <sidebar-toggle-button/>
      </div>
      <div
          class="navbar-toggle d-inline"
          :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand" href="#pablo">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
      <div class="search-bar input-group" @click="searchModalVisible = true">
        <!--
          <input type="text" class="form-control" placeholder="Search...">
          <div class="input-group-addon"><i class="tim-icons icon-zoom-split"></i></div>
        -->
        <!--        <button-->
        <!--          class="btn btn-link"-->
        <!--          id="search-button"-->
        <!--          data-toggle="modal"-->
        <!--          data-target="#searchModal"-->
        <!--        >-->
        <!--          <i class="tim-icons icon-zoom-split"></i>-->
        <!--        </button>-->
        <!-- You can choose types of search input -->
      </div>
      <modal
          :show.sync="searchModalVisible"
          class="modal-search"
          id="searchModal"
          :centered="false"
          :show-close="true"
      >
        <input
            slot="header"
            v-model="searchQuery"
            type="text"
            class="form-control"
            id="inlineFormInputGroup"
            placeholder="SEARCH"
        />
      </modal>

      <base-dropdown
          tag="li"
          :menu-on-right="!$rtl.isRTL"
          title-tag="a"
          class="nav-item"
          title-classes="nav-link"
          menu-classes="dropdown-navbar"
      >
        <template
            slot="title"
        >
          <div><i class="fas fa-user"/></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <a href="https://stjou.com" class="d-lg-none">Log out</a>
        </template>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item" @click="resetApplication();">Reset Application</a>
        </li>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item" @click="toggleTheme(themeNumber);">
            <span v-if="themeNumber%2!==0">Light Theme</span>
            <span v-if="themeNumber%2===0">Dark Theme</span>
          </a>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a href="https://github.com/charlie-sanders/stjou/issues" target="_blank" class="nav-item dropdown-item">Report
            an Issue</a>
        </li>
        <li class="nav-link">
          <a href="https://stjou.com" class="nav-item dropdown-item">Log out</a>
        </li>
        <li class="nav-link">
          <hr/>
        </li>
        <li class="nav-link">
          <span class="nav-item dropdown-item"> v1.44 - last released 2024.02.14</span>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import {BaseNav, Modal} from '@/components';
import SidebarToggleButton from './SidebarToggleButton';
import swal from "sweetalert2";

export default {
  components: {
    SidebarToggleButton,
    BaseNav,
    Modal
  },
  computed: {
    routeName() {
      const {name} = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },

  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
      themeNumber: 1,
    };
  },
  methods: {
    showUISettings() {
      this.$vueEventBus.$emit('showUISettings');
      // this.$emit('showUISettings');
    },
    resetApplication() {
      swal.fire({
        title: 'Do you want to completely reset the application ?  This cannot be undone.',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Cancel',
        denyButtonText: `Reset`,

      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {

          console.log('ignored: resetting application');

        } else if (result.isDenied) {
          console.log('saved: resetting application');
          this.$store.dispatch('resetApplication');
        }
      })
    },
    toggleTheme(type) {
      let docClasses = document.body.classList;
      if (type % 2 === 0) {
        docClasses.remove('white-content');
      } else {
        docClasses.add('white-content');
      }
      this.themeNumber += 1;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
