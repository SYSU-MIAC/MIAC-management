import Vue from 'vue'
import Router from 'vue-router'
import ArticleView from '../views/ArticleView.vue'
import ProfileView from '../views/ProfileView.vue'
import HomeworkView from '../views/HomeworkView.vue'
import IndexView from '../views/IndexView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {path: '/', component: ArticleView},
    {path: '/hw', component: HomeworkView},
    {path: '/profile', component: ProfileView},
    {path: '/index', component: IndexView}
  ]
})
