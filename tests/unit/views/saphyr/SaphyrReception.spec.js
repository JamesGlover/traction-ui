import Reception from '@/views/saphyr/SaphyrReception'
import { mount, localVue, store, Data } from 'testHelper'
import { newResponse } from '@/api/ResponseHelper'

describe('Reception', () => {
  let wrapper, reception, barcodes, barcode, input, router

  beforeEach(() => {
    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(Reception, { localVue, router, store })
    reception = wrapper.vm
  })

  describe('scanning in barcodes', () => {
    it('single barcode', () => {
      barcode = 'TRAC-1\n'
      input = wrapper.find('textarea')
      input.setValue(barcode)
      expect(reception.barcodes).toEqual(barcode)
    })

    it('multiple barcodes', () => {
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      expect(reception.barcodes).toEqual(barcodes)
    })
  })

  describe('findSampleExtractionTubes button', () => {
    beforeEach(() => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
      reception.handleSampleExtractionTubes = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findSampleExtractionTubes')
      button.trigger('click')
      expect(reception.handleSampleExtractionTubes).toBeCalled()
    })
  })

  describe('#handleSampleExtractionTubes', () => {
    beforeEach(() => {
      store.commit('sampleExtraction/setSampleExtractionTubes', [])

      wrapper = mount(Reception, { localVue, store })
      reception = wrapper.vm

      reception.getSampleExtractionTubesForBarcodes = jest.fn()
      reception.exportSampleExtractionTubesIntoTraction = jest.fn()
      reception.showAlert = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
    })

    it('successfully for samples', async () => {
      const mockSamplesExtractionResponse = newResponse({
        success: true,
        ...Data.SampleExtractionTubesWithSample,
      })

      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(mockSamplesExtractionResponse)

      const mockTractionResponse = newResponse({
        success: true,
        ...Data.Requests,
      })

      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(mockTractionResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes fails', async () => {
      const failedResponse = {
        success: false,
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      }

      const expectedResponse = newResponse({
        ...failedResponse,
        success: false,
      })

      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(expectedResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).not.toBeCalled()
      expect(reception.showAlert).toBeCalledWith(
        'Sample Extraction tubes failed to be imported',
        'danger',
      )
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes is empty', async () => {
      const emptyResponse = {
        success: true,
        data: { data: [] },
        status: 200,
        statusText: 'Success',
      }

      const expectedResponse = newResponse({
        ...emptyResponse,
        success: true,
      })

      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(expectedResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).not.toBeCalled()
      expect(reception.showAlert).toBeCalledWith(
        'Sample Extraction tubes failed to be imported',
        'danger',
      )
    })

    it('is unsuccessful when exportSampleExtractionTubesIntoTraction fails', async () => {})
    it('is unsuccessful when exportSampleExtractionTubesIntoTraction is empty', async () => {})
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      reception.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('#getBarcodes', () => {
    it('single barcode', () => {
      wrapper.setData({ barcodes: 'TRAC-1\n' })
      let result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1'])
    })

    it('multiple barcodes', () => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5' })
      let result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1', 'TRAC-2', 'TRAC-3', 'TRAC-4', 'TRAC-5'])
    })
  })
})
