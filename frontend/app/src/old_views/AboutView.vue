<template>
  <div class="container">
    <h1 class="pt-3 pb-3">About</h1>
    <p v-for="member in team" :key="member.name" for>{{ member.name }}</p>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      team: [
        { name: "Michelle Jiam" },
        { name: "Niks Hariman" },
        { name: "Nilo Van Winden" },
        { name: "Sanne Albreghs" },
        { name: "Swaan Miller" },
      ],
    };
  },
};
</script>
