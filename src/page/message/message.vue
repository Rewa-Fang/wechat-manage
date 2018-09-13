<template>
    <div id="box">
        <h1>{{ title }}</h1>
        <h2>{{ name }}</h2>
        <div>聂小倩是猪</div>
        <media-header></media-header>
    </div>

</template>

<script>
import header from "@/components/media/header";
export default {
  components: {
    mediaHeader: header
  },
  data() {
    return {
      title: "这是message",
      name: "message"
    };
  }
};
</script>

<style>
</style>


    

