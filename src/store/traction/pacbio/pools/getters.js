const serializeLibrary = (state) => ({ id, type, requests, tags }) => {
  const { sample_name } = state.requests[requests[0]]
  const { group_id } = state.tags[tags[0]]
  return { id, type, sample_name, group_id }
}

const serializePool = (state) => ({ id, type, libraries: libraryIds, tubes: [tubeId] }) => {
  const libraries = libraryIds.map((libraryId) =>
    serializeLibrary(state)(state.libraries[libraryId]),
  )
  const { barcode } = state.tubes[tubeId]

  return { id, type, libraries, barcode }
}

const getters = {
  poolRequest: (state, getters, rootState) => rootState.api.traction.pacbio.pools,
  pools: (state) => Object.values(state.pools).map(serializePool(state)),
  poolByBarcode: (state, { pools }) => (barcode) => pools.find((pool) => pool.barcode === barcode),
}

export default getters
