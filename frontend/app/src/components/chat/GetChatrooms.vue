<template>
  <section></section>
</template>

<script lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

const messages = ref([]);
onMounted(() =>
  axios.get("http://localhost:3000/message").then((response) => {
    messages.value = response.data; // returns the response data into the users variable which can then be used in the template
  })
);
</script>
