<template>
  <BaseCard>
    <template v-slot:title>
      Primeira interação
      <p class="grey--text ">
        Se refere ao primeiro envio, por exemplo, enviar o primeiro e-mail 1
        horas após a navegação.
      </p>
    </template>
    <template v-slot:body>
      <VRow>
        <VCol cols="12" sm="3" md="3">
          <samp>Valor</samp>
          <VTextField
            v-model="value"
            v-mask="'#####'"
            outlined
            required
            @change="setFirstInteraction"
          ></VTextField>
        </VCol>
        <VCol cols="12" sm="3" md="3">
          <samp>Tipo</samp>
          <v-select
            v-model="type"
            :items="options"
            item-text="name"
            item-value="value"
            outlined
            @change="setFirstInteraction"
          ></v-select>
        </VCol>
      </VRow>
    </template>
  </BaseCard>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      rules: {
        name: [(v) => ''],
      },
      value: '',
      type: '',
      options: [
        { value: 'minute', name: 'Minuto' },
        { value: 'hour', name: 'Hora' },
        { value: 'day', name: 'Dia' },
      ],
    }
  },
  created() {
    if (
      Array.isArray(this.trigger.config.firstInteraction) &&
      this.trigger.config.firstInteraction.length > 0
    ) {
      const [
        tempValue,
        tempType,
      ] = this.trigger.config.firstInteraction[0].split(' ')
      this.value = tempValue
      this.type = tempType
    }
  },
  methods: {
    setFirstInteraction() {
      this.trigger.config.firstInteraction = []
      for (let index = 0; index < 7; index++) {
        this.trigger.config.firstInteraction.push(`${this.value} ${this.type}`)
      }
    },
  },
}
</script>
