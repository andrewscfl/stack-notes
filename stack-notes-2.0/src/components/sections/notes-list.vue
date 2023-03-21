<template>
  <v-container id="ctr-notes_list" class="gray-1-bg" rounded>
    <v-row class="h-inherit">
      <v-col class="h-inherit">
        <div class="d-flex flex-column h-inherit">
          <v-text-field 
            v-model="search" 
            append-icon="fa fa-search" 
            single-line 
            hide-details 
            background-color="gray-2-bg"
            color="gray-4"
            dark
            small
            solo
            dense
            flat
            :placeholder="notes.length ? 'Find note' : 'Create a note!' "
            class="search my-0 py-0 secondary-font"
          /> 
          <!-- loop through notes -->
          <div class="ctr-notes"></div>
          <v-btn class="green-bg gray-4 secondary-font">
            <v-icon small class="fa fa-plus"></v-icon> &nbsp; New Note
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NotesList',
    props: {
      notes: {
        type: Array,
        required: true
      }
    },
    data(){
      return {
        search: '',
        displayed_notes: []
      }
    }
  }
</script>
<style lang="scss">
#ctr-notes_list {
  height: 485px;

  .search {
    border-radius: 5px;

    .v-input__slot {
      padding: 0 10px;}
  }

  .ctr-notes {
    height: 375;
    width: 100%;
    overflow-y: scroll;
  }
}
.h-inherit { height: inherit; }
</style>
