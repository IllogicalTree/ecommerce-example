import { createStore } from 'vuex';

const cloudantUrl = 'https://awesome-product-api.eu-gb.mybluemix.net';

export default createStore({
  state: {
    products: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    getProducts({ commit }) {
      fetch(`${cloudantUrl}/products`)
        .then((response) => response.json())
        .then((products) => commit('setProducts', products))
        .catch((error) => console.log(error));
    },
  },
  modules: {
  },
});
