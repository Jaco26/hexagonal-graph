import HexagonalGraph from './components/the-hexagonal-graph.js'

const app = new Vue({
  name: 'App',
  components: {
    HexagonalGraph
  },
  template: `
    <div class="app-wrap">
        <HexagonalGraph :width="500" :height="500" />

    </div>
  `,
  
})

app.$mount('#app')