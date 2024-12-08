import { defineStore } from 'pinia'
import { Storage } from '@/utils/storage'

export const useUserStore = defineStore({
  id: 'user-store',
  state: () => ({
    userInfo: {}
  }),
  getters: {
   
  },
  actions: {
    setUserInfo(val) {
      this.userInfo = val
    },
    clearUserInfo() {
      this.userInfo = {}
      Storage.set('token', '')
      Storage.set('userInfo', {})
    }
  }
})