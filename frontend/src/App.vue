<template>
  <!-- Navbar -->
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">TimeShift</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" :active="path  == '/'">Home</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- Alert -->

    <div class="container">
        <div class="row">
            <div>
                <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
                <router-view></router-view>
            </div>
        </div>
    </div>
    <!-- <router-view /> -->
  </div>

</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      path: this.$route && this.$route.path
    };
  },
  name: 'app',
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    })
  },
  watch: {
    //$route(to,from)
    $route(route) {
      this.path = route.path;
      // clear alert on location change
      this.clearAlert();
    }
  }
};
</script>
<style lang="scss">
.page {
  padding: 20px;
}
</style>
