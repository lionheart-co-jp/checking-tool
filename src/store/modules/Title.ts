import Vue from 'vue'
import types from '../types'

interface TitleStoreInterface {
  url: string
  response: any | null
}

const state: TitleStoreInterface = {
  url: '',
  response: null,
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.mutations.TITLE_URL](state: TitleStoreInterface, url: string): void {
    Vue.set(state, 'url', url)
  },
  [types.mutations.TITLE_RESPONSE](state: TitleStoreInterface, response: any): void {
    Vue.set(state, 'response', response)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
