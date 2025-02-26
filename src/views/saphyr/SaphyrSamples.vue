<template>
  <div>
    <traction-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <traction-input-group>
        <traction-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        >
        </traction-input>
        <traction-input-group-append>
          <traction-button :disabled="!filter" @click="filter = ''">Clear</traction-button>
        </traction-input-group-append>
      </traction-input-group>
    </traction-form-group>
    <br />

    <traction-table
      id="samples-table"
      show-empty
      responsive
      :items="requests"
      :fields="fields"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      select-mode="single"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span>&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span>&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrintLabel('saphyr', $event)"
      >
      </printerModal>

      <enzymeModal
        ref="enzymeModal"
        :disabled="selected.length === 0"
        class="float-left"
        @selectEnzyme="createLibraries"
      >
      </enzymeModal>

      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="requests.length"
        :per-page="perPage"
        aria-controls="samples-table"
      >
      </traction-pagination>
    </div>
    <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
    </traction-form-group>
  </div>
</template>

<script>
import EnzymeModal from '@/components/saphyr/SaphyrEnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import PrintHelper from '@/mixins/PrintHelper'
import TableHelper from '@/mixins/TableHelper'
import * as consts from '@/consts/consts'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SaphyrSamples',
  components: {
    EnzymeModal,
    PrinterModal,
  },
  mixins: [PrintHelper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
      ],
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/saphyr/requests', ['requests']),
  },
  created() {
    this.provider()
  },
  methods: {
    async createLibraries(selectedEnzymeId) {
      let payload = { samples: this.selected, enzymeID: selectedEnzymeId }
      let response = await this.createLibrariesInTraction(payload)

      if (response.successful || !response.empty) {
        let barcodes = response.deserialize.libraries.map((l) => l.barcode)
        this.showAlert('Libraries successfully created with barcodes: ' + barcodes, 'success')
      } else {
        this.showAlert(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED, 'danger')
      }
    },
    async provider() {
      try {
        await this.setRequests()
      } catch (err) {
        console.error(err)
      }
    },
    ...mapActions('traction/saphyr/tubes', ['createLibrariesInTraction']),
    ...mapActions('traction/saphyr/requests', ['setRequests']),
  },
}
</script>
