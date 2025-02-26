<template>
  <traction-container>
    <traction-row>
      <traction-col>
        <traction-form v-if="show" class="text-left" @submit="onSubmit" @reset="onReset">
          <traction-form-group
            id="barcode-input-group"
            label="Barcode:"
            label-for="barcode-input"
            description="A single barcode to create labels for."
          >
            <traction-input
              id="barcode-input"
              v-model="form.barcode"
              placeholder="Please scan the barcode"
              required
            ></traction-input>
          </traction-form-group>

          <traction-form-group
            id="suffix-selection-group"
            label="Suffix:"
            label-for="suffix-selection"
            description="The suffix used to increment the barcode."
          >
            <traction-select
              id="suffix-selection"
              v-model="form.selectedSuffix"
              :options="suffixOptions"
              value-field="text"
              placeholder="Please select a suffix"
              required
            ></traction-select>
          </traction-form-group>

          <traction-form-group
            id="number-of-labels-group"
            label="Number of labels:"
            label-for="number-of-labels"
            description="Number of labels to print (max 9)"
          >
            <traction-input
              id="number-of-labels"
              v-model="form.selectedNumberOfLabels"
              type="number"
              :min="1"
              :max="9"
              placeholder="Please enter a number"
              required
            ></traction-input>
          </traction-form-group>

          <traction-form-group
            id="printer-choice-group"
            label="Choice of Printer:"
            label-for="printer-choice"
            description="The printer to print the labels."
          >
            <traction-select
              id="printer-choice"
              v-model="form.selectedPrinterName"
              :options="printerOptions"
              value-field="text"
              required
            ></traction-select>
          </traction-form-group>

          <traction-form-group
            id="copies-group"
            label="Number of copies per label:"
            label-for="copies"
            description="Number of copies of each label you would like to print. (Only supported by Squix printers)"
          >
            <traction-input
              id="copies"
              v-model="form.copies"
              type="number"
              :min="1"
              :max="10"
              placeholder="Please select a number"
              required
            ></traction-input>
          </traction-form-group>

          <traction-button id="submit-button" type="submit" theme="print"
            >Print Labels</traction-button
          >
          <traction-button id="reset-button" type="reset" theme="default" class="float-left"
            >Reset</traction-button
          >
        </traction-form>
      </traction-col>
      <traction-col>
        <div>
          <traction-card
            title="List of barcodes to be printed:"
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <traction-card-text>
              <ul id="list-barcodes-to-print">
                <li v-for="(item, index) in suffixedBarcodes()" :key="index + 1">{{ item }}</li>
              </ul>
            </traction-card-text>
          </traction-card>
        </div>
      </traction-col>
    </traction-row>
  </traction-container>
</template>

<script>
import SuffixList from '@/config/SuffixList'
import { mapActions } from 'vuex'

const defaultForm = () => ({
  barcode: null,
  selectedSuffix: null,
  selectedNumberOfLabels: null,
  selectedPrinterName: null,
  copies: null,
})

export default {
  name: 'LabelPrintingForm',
  data() {
    return {
      form: defaultForm(),
      suffixOptions: [],
      printerOptions: [],
      show: true,
    }
  },
  created() {
    this.setSuffixOptions()
    this.setPrinterNames()
  },
  methods: {
    setSuffixOptions() {
      let suffixOptions = SuffixList.map((obj) => ({
        text: obj.one_character_name,
      }))
      this.suffixOptions = suffixOptions
    },
    setPrinterNames() {
      let printerOptions = this.$store.getters.printers.map((name) => ({
        text: name,
      }))
      this.printerOptions = printerOptions
    },
    suffixedBarcodes() {
      var listSuffixedBarcodes = []

      if (this.form.barcode && this.form.selectedSuffix && this.form.selectedNumberOfLabels <= 9) {
        for (let i = 0; i < this.form.selectedNumberOfLabels; i++) {
          listSuffixedBarcodes.push(this.form.barcode.concat('-', this.form.selectedSuffix, i + 1))
        }
      }
      return listSuffixedBarcodes
    },
    printerName() {
      return this.form.selectedPrinterName
    },
    onSubmit(event) {
      event.preventDefault()
      this.sendPrintRequest()
    },
    onReset(event) {
      event.preventDefault()

      // Reset our form values
      this.form = defaultForm()

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async sendPrintRequest() {
      const params = {
        printerName: this.printerName(),
        barcodesList: this.suffixedBarcodes(),
        copies: this.form.copies,
      }
      const printJobV2Response = await this.printJobV2(params)
      this.showAlert(
        printJobV2Response.data.message,
        printJobV2Response.success ? 'success' : 'danger',
      )
    },
    ...mapActions('printMyBarcode', ['printJobV2']),
  },
}
</script>
