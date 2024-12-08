import { defineStore } from 'pinia'

export const useMapStore = defineStore({
  id: 'map-store',
  state: () => ({
    mapSchoolData: [],
  }),
  getters: {
    
  },
  actions: {
    setMapSchoolData(value) {
      this.mapSchoolData = value
    },
  }
})