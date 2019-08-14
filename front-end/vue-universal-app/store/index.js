export const state = () => ({
  loading: false,
})

export const mutations = {
  START_LOADING (state) {
    state.loading = true;
  },

  STOP_LOADING (state) {
    state.loading = false;
  },
}
