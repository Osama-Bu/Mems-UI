<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
<!--         <img v-if="logo" :src="logo" class="sidebar-logo">-->
        <div class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }" v-html="title"></div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
<!--         <img v-if="logo" :src="logo" class="sidebar-logo">-->
        <div class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }" v-html="title"></div>
      </router-link>
    </transition>
  </div>
</template>

<script>
    import logoImg from '@/assets/logo/logo.png'
    import variables from '@/assets/styles/variables.scss'

    export default {
        name: 'SidebarLogo',
        props: {
            collapse: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            variables() {
                return variables;
            },
            sideTheme() {
                return this.$store.state.settings.sideTheme
            }
        },
        data() {
            return {
                title: this.$t('system.title_flux'),
                logo: logoImg
            }
        },
        mounted() {

            if (this.$store.getters.remark == null) {
              this.title = this.$t('system.title_flux');
            }else  if (this.$store.getters.name==='admin') {
              this.title = this.$t('system.title');
            }else {
              this.title = decodeURI(this.$store.getters.remark)
            }
        },
    }
</script>

<style lang="scss" scoped>
  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 49px;
        height: 35px;
        vertical-align: middle;
        margin-left: -6px;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        margin-top: 5px;
        color: #fff;
        font-weight: 600;
        line-height: 1.5;
        font-size: 16px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
        //margin-left: 0px;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 92%;
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0;
      }
    }
  }
</style>
