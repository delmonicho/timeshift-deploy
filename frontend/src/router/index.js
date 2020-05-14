import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage';
import 'fullcalendar/dist/fullcalendar.css'

Vue.use(Router);

// The vue router defines all of the routes for the application, and contains a function that runs before each route change to prevent unauthenticated users from accessing restricted routes
export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage
    },
    //otherwise redirect to Home
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})
