import Vue from 'vue'
import types from '../types'

interface HeadLineStoreInterface {
  url: string
  list: any[]
}

const state: HeadLineStoreInterface = {
  url: '',
  list: [],
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.mutations.HEADLINE_URL](state: HeadLineStoreInterface, url: any[]): void {
    Vue.set(state, 'url', url)
  },
  [types.mutations.HEADLINE_LIST](state: HeadLineStoreInterface, list: any[]): void {
    Vue.set(state, 'list', list)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
