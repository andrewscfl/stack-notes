<template>
  <v-container fluid id="main-ui">
    <v-row>
      <v-col cols="12" sm="12" md="3">
        <h1 class="main-font">
          <span class="primary-color">stack</span>
          <span class="gray-4">.</span>
          <span class="secondary-color">notes</span>
          <span class="gray-4">();</span>
        </h1>
        <!-- <v-icon class="fa fa-house"></v-icon> -->
      </v-col>
    </v-row>
    <v-row mt-5>
      <v-col cols="12" sm="12" md="3">
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'MainUI',
    data(){
      return {}
    }
  }
</script>

<style lang="scss">
#main-ui {
  background-color: $gray-3;
  height: 100vh;
}
</style>
