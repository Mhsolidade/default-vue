<template>
  <VRow align="center" justify="center">
    <VCol xs="12" md="11" class="elevation-2  grey lighten-5">
      <configurationLink
        title="Banners"
        subtitle="Cadastre banners com prazo de validade para serem utilizados nos templates."
        btnTitle="Administrar"
        routerName="banner"
      ></configurationLink>
      <configurationLink
        title="Quantidade máxima de envio"
        subtitle="Configure a quantidade máxima de envios que cada usuário poderá receber por dia."
        btnTitle="Administrar"
        routerName="configuration"
      >
        <template v-slot:action>
          <VCol align-self="center">
            <VTextField
              v-model="config.dailyEmailLimit"
              label="Limite diário"
            ></VTextField>
          </VCol>
          <VCol align-self="center">
            <VBtn color="white" block @click="saveDailyEmailLimit">Salvar</VBtn>
          </VCol>
        </template>
      </configurationLink>
      <configurationLink
        title="Temas"
        subtitle="Crie temas padrões para o seu HTML e temas sazonais para datas comemorativas."
        btnTitle="Administrar"
        routerName="theme"
      ></configurationLink>
      <configurationLink
        title="Templates"
        subtitle="Crie, edite e visualize todos os seus templates."
        btnTitle="Administrar"
        routerName="template"
      ></configurationLink>
      <configurationLink
        title="URL’s"
        subtitle="Cadastre links para serem utilizados nos templates."
        btnTitle="Administrar"
        routerName="url"
      ></configurationLink>
    </VCol>
  </VRow>
</template>
<script>
import configurationLink from '@components/configuration-link.vue'
import { baseConfigMethods, alertMethods } from '@state/helpers'

export default {
  components: {
    configurationLink,
  },
  props: {
    config: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  methods: {
    ...baseConfigMethods,
    ...alertMethods,
    async saveDailyEmailLimit() {
      await this.updateConfig(this.config)
      this.newAlert(
        `Limite diário atualizado com sucesso: ${this.config.dailyEmailLimit}`
      )
    },
  },
}
</script>
<style lang="scss" module>
.card {
  height: 100%;
  width: 100%;
}
</style>
