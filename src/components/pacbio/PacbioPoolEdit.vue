<template>
  <div data-type="pool">
    <h3>
      Pooled Samples <traction-badge data-attribute="pool-type">{{ poolType }}</traction-badge>
    </h3>
    <traction-row class="mb-1">
      <traction-col>
        <traction-checkbox
          v-model="autoTag"
          name="check-button"
          switch
          data-attribute="auto-tagging"
        >
          Autotagging
        </traction-checkbox>
      </traction-col>
      <traction-col>
        <traction-file
          id="qcFileInput"
          ref="qc-file-form-field"
          :state="parsedFile"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          accept="text/csv, .csv"
          size="sm"
          @input="uploadFile"
        ></traction-file>
      </traction-col>
    </traction-row>
    <PacbioPoolLibraryList :auto-tag="autoTag" />
    <div class="pool-edit" data-type="pool-edit">
      <traction-table-simple>
        <traction-tr>
          <traction-td v-if="!!tubeItem.barcode" class="barcode" data-attribute="barcode">
            pool barcode: {{ tubeItem.barcode }}
          </traction-td>
          <traction-td v-else>&nbsp;</traction-td>
          <traction-td class="template-prep-kit-box-barcode">
            <traction-input
              v-model="poolItem.template_prep_kit_box_barcode"
              data-attribute="template-prep-kit-box-barcode"
              :value="poolItem.template_prep_kit_box_barcode"
              placeholder="Template Prep Kit Box Barcode"
              type="text"
              title="Template Prep Kit Box Barcode"
            />
          </traction-td>
          <traction-td class="pool-attribute">
            <traction-input
              v-model="poolItem.volume"
              data-attribute="volume"
              :value="poolItem.volume"
              placeholder="Volume"
              type="text"
              title="Volume"
            />
          </traction-td>
          <traction-td class="pool-attribute">
            <traction-input
              v-model="poolItem.concentration"
              data-attribute="concentration"
              :value="poolItem.concentration"
              placeholder="Concentration"
              type="text"
              title="Concentration"
            />
          </traction-td>
          <traction-td class="pool-attribute">
            <traction-input
              v-model="poolItem.insert_size"
              data-attribute="insert-size"
              :value="poolItem.insert_size"
              placeholder="Insert Size"
              type="text"
              title="Insert Size"
            />
          </traction-td>
        </traction-tr>
      </traction-table-simple>
    </div>
    <div class="text-right">
      <traction-button
        v-if="!persisted"
        data-action="create-pool"
        theme="create"
        :disabled="busy"
        @click="create()"
      >
        <span class="button-text">Create Pool </span>
        <traction-spinner v-show="busy" small></traction-spinner>
      </traction-button>
      <traction-button
        v-if="persisted"
        data-action="update-pool"
        theme="update"
        :disabled="busy"
        @click="update()"
      >
        <span class="button-text">Update Pool </span>
        <traction-spinner v-show="busy" small></traction-spinner>
      </traction-button>
    </div>
  </div>
</template>

<script>
import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { createNamespacedHelpers } from 'vuex'
import { eachRecord } from '@/lib/csv/pacbio'

const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PoolEdit',
  components: {
    PacbioPoolLibraryList,
  },
  data() {
    return {
      busy: false,
      autoTag: false,
      parsedFile: null,
    }
  },
  computed: {
    ...mapGetters(['poolItem', 'tubeItem', 'selectedRequests']),
    persisted() {
      return !!this.poolItem.id
    },
    poolType() {
      switch (this.selectedRequests.length) {
        case 0:
          return 'Empty'
        case 1:
          return 'Library'
        default:
          return 'Pool'
      }
    },
  },
  methods: {
    ...mapActions(['createPool', 'updatePool', 'updateLibraryFromCsvRecord']),
    create() {
      this.busy = true
      this.createPool().then(({ success, barcode, errors }) => {
        success
          ? this.showAlert(
              `Pool successfully created with barcode ${barcode}`,
              'success',
              'pool-create-message',
            )
          : this.showAlert(errors, 'danger', 'pool-create-message')
        this.busy = false
      })
    },
    update() {
      this.busy = true
      this.updatePool().then(({ success, errors }) => {
        success
          ? this.showAlert(`Pool successfully updated`, 'success', 'pool-create-message')
          : this.showAlert(errors, 'danger', 'pool-create-message')
        this.busy = false
      })
    },
    async uploadFile(newFile) {
      if (newFile === null) {
        this.parsedFile = null
        return
      }

      try {
        const csv = await newFile.text()
        eachRecord(csv, this.updateLibraryFromCsvRecord)
        this.parsedFile = true
      } catch (error) {
        console.error(error)
        this.showAlert(error, 'danger', 'pool-create-message')
        this.parsedFile = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';

.button-text {
  padding-right: 2px;
  position: relative;
  top: 2px;
}
.custom-select,
.form-control {
  font-size: 0.8em;
}
.pool-edit {
  padding-bottom: 5px;
  padding-top: 5px;
}
.td-empty {
  width: 110px;
}
.barcode {
  width: 250px;
  font-size: 0.8em;
  font-weight: bold;
  text-align: right;
}
.pool-attribute {
  width: 90px;
}
.template-prep-kit-box-barcode {
  width: 120px;
}

.col {
  // See https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring
  // When the DOM content changes, the browser uses a 'scroll-anchor' to try and
  // prevent the viewport visibly jumping around as the DOM content re-renders.
  // Under some circumstances, which I haven't been able to reproduce, the
  // browser appears to use elements in this column as the anchor. This causes
  // the page to track elements in this column as wells are added to the pool,
  // making selection tricky. This CSS property *should* stop the browser using
  // these elements as anchors.
  overflow-anchor: none;
}
</style>
