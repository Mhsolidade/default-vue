<template>
  <BaseCard>
    <template v-slot:title>
      Configurações do HTML
    </template>
    <template v-slot:body>
      <VCol cols="12" sm="6" md="6">
        <VRow align="center">
          <span class="mr-5">Tipo do HTML: </span>
          <VBtn
            class="mr-2"
            small
            :outlined="type !== 1"
            color="info"
            @click="dynamic"
          >
            dinâmico
          </VBtn>
          <VBtn small :outlined="type !== 2" color="info" @click="type = 2">
            estático
          </VBtn>
        </VRow>
      </VCol>

      <VRow v-if="type === 2">
        <VCol cols="12" md="11">
          <span>HTML</span>
          <v-textarea
            v-model="html"
            class="mt-0"
            rows="15"
            row-height="20"
            outlined
            no-resize
            @change="setHtml"
          ></v-textarea>
        </VCol>
        <VSpacer></VSpacer>
      </VRow>
      <VRow v-if="type === 1">
        <VCol
          cols="12"
          md="6"
          class="mx-0 px-0"
          v-for="(item, index) in trigger.triggerThemeTemplate"
          :key="index"
        >
          <p>Template</p>
          <VSelect
            v-model="item.templateId"
            no-data-text="Lista indisponível"
            hide-details
            :items="templates"
            item-text="name"
            item-value="id"
            outlined
            @blur="setHtml"
            @input="setHtml"
            @change="setHtml"
          ></VSelect>
          <VSpacer></VSpacer>
          <p>Tema</p>
          <VSelect
            v-model="item.themeId"
            no-data-text="Lista indisponível"
            hide-details
            :items="themes"
            item-text="name"
            item-value="id"
            outlined
            @blur="setHtml"
            @input="setHtml"
            @change="setHtml"
          ></VSelect>
          <VSpacer></VSpacer>
        </VCol>
      </VRow>
      <VCol class="mx-0 px-0">
        <VBtn
          v-if="!!trigger.id"
          :loading="previewLoading"
          outlined
          color="success"
          @click="getHtmlTest"
        >
          Pré-visualizar
        </VBtn>
      </VCol>
      <BaseDialogPreview
        v-if="preview"
        v-model="preview"
        :html="htmlPreview"
      ></BaseDialogPreview>
    </template>
  </BaseCard>
</template>
<script>
/* eslint-disable eqeqeq */
export default {
  props: {
    trigger: {
      type: Object,
      default: () => {},
      require: true,
    },
    templates: {
      type: Array,
      default: () => {
        return []
      },
    },
    themes: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      type: 1,
      template: null,
      theme: null,
      html: '',
      htmlPreview: '',
      preview: false,
      previewLoading: false,
    }
  },
  computed: {},
  mounted() {
    if (this.trigger.triggerThemeTemplate.length === 0) {
      this.type = 2
      this.html = this.trigger.tpl
    }
  },
  methods: {
    setHtml() {
      this.trigger.tpl = this.htmlPreview
      this.trigger.tplTest = this.htmlPreview
    },
    async getHtmlTest() {
      this.previewLoading = true
      this.htmlPreview = await this.$store.dispatch(
        'trigger/generateHtmlTest',
        this.trigger.id
      )
      this.previewLoading = false
      this.preview = true
    },
    dynamic() {
      console.log(this.trigger.triggerThemeTemplate.length)
      if (this.trigger.triggerThemeTemplate.length === 0) {
        this.trigger.triggerThemeTemplate.push({
          themeId: null,
          templateId: null,
        })
      }
      this.type = 1
    },
  },
}
</script>
