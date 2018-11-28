import Vue from 'vue'
import types from '../types'

interface AppStoreInterface {
  url: string
  user: string
  pass: string
}

const state: AppStoreInterface = {
  url: 'https://www.lionheart.co.jp',
  user: '',
  pass: '',
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.mutations.APP_URL](state: AppStoreInterface, url: string): void {
    Vue.set(state, 'url', url)
  },
  [types.mutations.APP_USER](state: AppStoreInterface, user: string): void {
    Vue.set(state, 'user', user)
  },
  [types.mutations.APP_PASS](state: AppStoreInterface, pass: string): void {
    Vue.set(state, 'pass', pass)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
