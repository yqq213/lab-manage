import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const subRoute = [
  {
    path: 'lab',
    name: 'lab',
    component: () => import('@/views/lab/index.vue'),
    meta: { title: '实验室管理' }
  },
  {
    path: 'equip',
    name: 'equip',
    component: () => import('@/views/equip/index.vue'),
    meta: { title: '设备管理' }
  },
  {
    path: 'group',
    name: 'group',
    component: () => import('@/views/group/index.vue'),
    meta: { title: '分组管理' }
  },
  {
    path: 'person',
    name: 'person',
    component: () => import('@/views/person/index.vue'),
    meta: { title: '人员管理' }
  },
  {
    path: 'data',
    name: 'data',
    component: () => import('@/views/data/index.vue'),
    meta: { title: '数据管理' }
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/lab',
    component: () => import('@/views/layout/index.vue'),
    children: subRoute
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router