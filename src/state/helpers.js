import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', ['currentUser', 'permission']),
  ...mapGetters('auth', ['loggedIn']),
}

export const authMethods = mapActions('auth', [
  'logIn',
  'logOut',
  'updatedBaseInfo',
  'changePassword',
])

export const layoutMenuMethods = mapActions('layoutMenu', [
  'toggleActivateMenu',
  'setActivateMenu',
])

export const layoutMenuComputed = {
  ...mapGetters('layoutMenu', ['activateMenu']),
  ...mapState('layoutMenu', ['links']),
}

export const alertComputde = {
  ...mapGetters('alert', ['active', 'text']),
}
export const alertMethods = mapActions('alert', ['newAlert'])

export const confirmationComputde = {
  ...mapGetters('confirmation', [
    'description',
    'title',
    'promise',
    'active',
    'params',
  ]),
}

export const confirmationMethods = mapActions('confirmation', [
  'setConfirmation',
  'cancel',
])

export const bannerComputed = {
  ...mapState('banner', {
    banner: (state) => state.banner,
  }),
  // ...mapGetters('banner', ['banner']),
}

export const baseConfigComputed = {
  ...mapState('baseConfig', {
    baseConfig: (state) => state.baseConfig,
  }),
  ...mapGetters('baseConfig', ['baseConfig']),
}
export const baseConfigMethods = mapActions('baseConfig', [
  'fetchConfig',
  'updateConfig',
])
export const themeMethods = mapActions('theme', ['fetchThemes'])

export const templateMethods = mapActions('template', ['fetchTemplates'])

export const engineMethods = mapActions('engine', ['fetchEngines'])

export const engineComputed = {
  ...mapState('engine', {
    engines: (state) => state.engines,
  }),
}

export const tiggerMethods = mapActions('trigger', [
  'getDisabledEnabledTriggers',
])
