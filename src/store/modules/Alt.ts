import Vue from 'vue'
import types from '../types'

interface AltStoreInterface {
  url: string
  images: any[]
}

const state: AltStoreInterface = {
  url: '',
  images: [],
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.mutations.ALT_URL](state: AltStoreInterface, url: any[]): void {
    Vue.set(state, 'url', url)
  },
  [types.mutations.ALT_IMAGES](state: AltStoreInterface, images: any[]): void {
    Vue.set(state, 'images', images)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
