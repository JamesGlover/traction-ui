<template>
  <traction-select
    id="data-type"
    :value="value"
    :options="dataTypes"
    @input="handleInput"
  ></traction-select>
</template>

<script>
import useSWRV from 'swrv'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

export default {
  name: 'DataTypeSelect',
  props: {
    pipeline: {
      // Filter to only list data_types for a given pipeline, leave null
      // to apply no filters
      type: String,
      required: false,
      default: null,
    },
    value: {
      // The data type, we use value to allow us to simply bind it with v-model
      type: String,
      default: undefined,
    },
  },
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data: remoteDataTypes } = useSWRV(
      `${baseURL}/v1/data_types?fields[data_types]=name,pipeline`,
    )
    return { remoteDataTypes }
  },
  computed: {
    filters: ({ pipeline }) => (pipeline ? { pipeline } : {}),
    filteredDataTypes() {
      return filterByAttribute(this.remoteDataTypes?.data || [], this.filters)
    },
    dataTypes() {
      return mapAttribute(this.filteredDataTypes, 'name')
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('input', input)
    },
  },
}
</script>

<style></style>
