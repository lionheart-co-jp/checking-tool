import Vue from 'vue'
import types from '../types'

interface LinkStoreInterface {
  url: string
  anchors: any[]
}

const state: LinkStoreInterface = {
  url: '',
  anchors: [],
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.mutations.LINK_URL](state: LinkStoreInterface, url: any[]): void {
    Vue.set(state, 'url', url)
  },
  [types.mutations.LINK_ANCHORS](state: LinkStoreInterface, anchors: any[]): void {
    Vue.set(state, 'anchors', anchors)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
