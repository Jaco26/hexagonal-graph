import HexagonalGraph from './components/the-hexagonal-graph.js'

const app = new Vue({
  name: 'App',
  components: {
    HexagonalGraph
  },
  template: `
    <div class="app-wrap">
      <h1>Hello From The App</h1>
      <HexagonalGraph />
    </div>
  `,
  
})

app.$mount('#app')