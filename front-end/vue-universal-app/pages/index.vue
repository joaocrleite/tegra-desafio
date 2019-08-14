<template>
  <div class="container">
    <SearchBar @refreshResults="refreshResults"></SearchBar>
    <ResultList :results="results"></ResultList>
  </div>
</template>

<script>
import SearchBar from '~/components/SearchBar'
import ResultList from '~/components/ResultList'

export default {
  name: "HomePage",
  components:{
    SearchBar,
    ResultList
  },
  data() {
    return {
      results: []
    };
  },
  mounted() {

  },
  methods: {
    refreshResults(results){
      this.results = results;
    }
  }
};
</script>
