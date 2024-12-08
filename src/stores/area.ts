import { defineStore } from 'pinia'
import type { AreaNode } from '@/api/area/model';
import { areaPath } from '@/utils'; 
export interface IAreaState {
  currentArea: AreaNode | null,
  currentSchoolId?: string,
  userArea: AreaNode,
  userSchoolId?: string
}

const reqAreaFieldMap = ['provinceId','cityId','countyId']

export const useAreaStore = defineStore({
  id: 'area-store',
  state: (): IAreaState => ({
    currentArea: null,
    userArea: {} as AreaNode,
    userSchoolId: 'ab3ca7e012794a679a66715471def14f' //userSchoolId: 'da9592f8c2de472595ed9d5a73134f5d'
  }),
  getters: {
    getCurrentAreaId(state) {
      return state.currentArea?.id
    },
    reqParam(state) {
      let reqParam:any = {}
      if(state.currentArea) {
        let pathArray = areaPath(state.currentArea.hierarchy+state.currentArea.id)
        for(let i in pathArray) {
          reqParam[reqAreaFieldMap[i]] = pathArray[i]
        }
        reqParam.defaultLevel = state.currentArea.level
      }
      if(state.currentSchoolId) {
        reqParam.schoolId = state.currentSchoolId
        reqParam.defaultLevel = 4
      }
      return reqParam
    },
  },
  actions: {
    setCurrentStore(area:AreaNode) {
      this.currentArea = area
    },
  }
})
