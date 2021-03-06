import axios from '@plugins/axios'

export const state = {
  currentUser: getSavedState('auth.currentUser'),
  token: getSavedState('auth.token'),
  permission: getSavedState('auth.permission'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    if (newValue) {
      if ('clients' in newValue) {
        newValue.clients = newValue.clients
          .replace(/"/g, "'")
          .replace(/\]/g, '')
          .replace(/\[/g, '')
          .split(',')
      }
    }
    state.currentUser = newValue
    saveState('auth.currentUser', state.currentUser)
    setDefaultAuthHeaders(state)
  },
  SET_TOKEN(state, newValue) {
    state.token = newValue
    saveState('auth.token', state.token)
    setDefaultAuthHeaders(state)
  },
  SET_CURRENT_PERMISSION(state, newValue) {
    state.permission = newValue
    saveState('auth.permission', state.permission)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },

  // Logs in the current user.
  async logIn({ commit, dispatch, getters }, { username, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')
    const laravelSession = await axios
      .post('/api/admin/Authenticate/loginApi', {
        // .post('http://localhost/auth-api/login', {
        email: username,
        password: password,
        remember: true,
      })
      .then((response) => {
        return response.data.token
      })

    if (!laravelSession) return Promise.resolve(false)
    commit('SET_TOKEN', laravelSession)
    setDefaultAuthHeaders(state)
    await dispatch('engine/fetchEngines', null, { root: true })
    const user = await dispatch('fetchUser')
    await dispatch('client/fetchClient', null, { root: true })
    return Promise.resolve(user)
  },

  // Logs out the current user.
  logOut({ commit, dispatch }) {
    commit('SET_CURRENT_USER', null)
    commit('SET_TOKEN', null)
    commit('SET_CURRENT_PERMISSION', null)
    dispatch('client/clearCurrentClientId', null, { root: true })
    dispatch('engine/fetchEngines', null, { root: true })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async validate({ commit, state, dispatch }) {
    if (!state.token) return Promise.resolve(false)
    if (!state.currentUser) return Promise.resolve(false)
    const user = await dispatch('fetchUser')
    return Promise.resolve(user)
  },
  fetchUser({ commit }) {
    console.log('fetchUser')
    return (
      axios
        .get('/api/sas/user')
        // .get('http://490b39239ef9.ngrok.io/auth-api/user')

        .then((response) => {
          const user = response.data.user
          const permission = response.data.perm
          commit('SET_CURRENT_USER', user)
          commit('SET_CURRENT_PERMISSION', permission)
          return Promise.resolve(user)
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            commit('SET_CURRENT_USER', null)
            commit('SET_TOKEN', null)
            commit('SET_CURRENT_PERMISSION', null)
          } else {
            console.warn(error)
          }
          return Promise.reject(error)
        })
    )
  },

  updatedBaseInfo({ commit, state }, { name, email }) {
    return axios
      .put('/api/admin/Users/saveCurrent', { name, email })
      .then((response) => {
        const user = response.data.user
        user.clientId = state.currentUser.clientId
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          return Promise.reject(error.response.data)
        } else {
          console.warn(error)
        }
        return null
      })
  },
  changePassword(
    { commit, state },
    { currentPassword, password, passwordConfirmation }
  ) {
    return axios
      .put('/api/admin/Users/changePass', {
        currentPassword,
        password,
        passwordConfirmation,
      })
      .then((response) => {
        const user = state.currentUser
        return Promise.resolve(user)
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          return Promise.reject(error.response.data)
        } else {
          console.warn(error)
        }
      })
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.token
    ? `${state.token}`
    : ''
}
