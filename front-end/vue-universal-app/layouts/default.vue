<template>
  <main>

    <header>
      <b-tabs position="is-centered" class="block" v-model="tab">
        <b-tab-item label="Hospedagens" icon="bed-empty" disabled></b-tab-item>
        <b-tab-item label="Passagens" icon="airplane"></b-tab-item>
        <b-tab-item label="Pacotes" icon="briefcase" disabled></b-tab-item>
        <b-tab-item label="Carros" icon="car" disabled></b-tab-item>
      </b-tabs>
    </header>

    <nuxt />

    <b-loading :active.sync="isLoading"></b-loading>

  </main>
</template>

<script>
export default {
  data () {
    return {
      tab : 1
    }
  },
  computed: {
    isLoading(){
      return this.$store.state.loading;
    }
  }
}
</script>

