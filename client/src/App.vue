<template>
  <div id="app">
    <mu-row class="tab-container">
      <mu-col desktop="30">
        <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab :disabled="true" title="MIAC"/>
          <mu-tab value="/" title="文章"/>
          <mu-tab value="/hw" title="作业"/>
        </mu-tabs>
      </mu-col>
      <mu-col desktop="10">
        <mu-row class="brief-profile-container">
          <mu-col desktop="30">
            <div class="tab-text-align-helper">
              <mu-avatar class="vertical-center" :src="headimg" :size="30"/>
            </div>
          </mu-col>
          <mu-col desktop="50">
            <div class="tab-text-align-helper">
              <span class="vertical-center">{{username}}</span>
            </div>
          </mu-col>
          <mu-col desktop="20">
            <mu-icon-menu
              icon="expand_more"
              :anchorOrigin="leftBottom"
              :targetOrigin="leftTop"
            >
              <mu-menu-item title="修改信息" rightIcon="settings" @click="goToSetting"/>
              <mu-menu-item title="登出" rightIcon="exit_to_app" @click="logout"/>
            </mu-icon-menu>
          </mu-col>
        </mu-row>
      </mu-col>
    </mu-row>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      activeTab: '/',
      leftBottom: {horizontal: 'left', vertical: 'bottom'},
      leftTop: {vertical: 'top', horizontal: 'left'},
      username: 'Elizabeth',
      headimg: '/static/img/ji.png'
    }
  },
  methods: {
    handleTabChange (val) {
      this.$router.push(val)
      this.activeTab = val
    },
    goToSetting () {
      this.activeTab = ''
      this.$router.push('/profile')
    },
    logout () {
      // TODO
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tab-container {
  background-color: #474A4F;
  text-align: center;
  color: white;
  padding-right: 50px;
}

.brief-profile-container {
  height: 48px;
}

.tab-text-align-helper {
  display: inline-block;
  position: relative;
  height: 48px;
  width: 100%;
}

.vertical-center {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}

/*修改下拉菜单宽度*/
.mu-menu {
  width: 115px;
}
</style>
