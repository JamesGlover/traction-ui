import OntPlates from '@/views/ont/OntPlates'
import OntPlate from '@/components/ont/OntPlate'
import Alert from '@/components/Alert'
import { mount, localVue } from '../../testHelper'

describe('OntPlates.vue', () => {
  let wrapper, plates, platesData

  beforeEach(() => {
    platesData = [
      { id: 1, barcode: 'TRAC-1-1' },
      { id: 2, barcode: 'TRAC-1-2' }
    ]

    wrapper = mount(OntPlates, {
      localVue,
      stubs: {
        OntPlate: true
      },
      data() {
        return {
          plates: platesData
        }
      },
      methods: {
        refetchPlates() { return }
      }
    })
    plates = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlates')
  })

  it('will have fields', () => {
    expect(plates.fields.map(field => field.key)).toEqual(expect.arrayContaining(['id', 'barcode', 'createdAt', 'show_details']))
  })

  describe('components', () => {
    it('has a Alert component', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table with plates', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(platesData.length)
  })

  describe('Plate display button', () => {
    let button

    it('is present for each plate', () => {
      button = wrapper.find('#details-btn-1')
      expect(button.text()).toEqual('Show Plate')
    })

    it('has a OntPlate component on button click', () => {
      button = wrapper.find('#details-btn-1')
      button.trigger('click')
      expect(wrapper.contains(OntPlate)).toBe(true)
    })
  })

  describe('#alert', () => {
    it('shows an alert', () => {
      plates.showAlert = jest.fn()
      plates.alert('message', 'type')
      expect(plates.showAlert).toBeCalledWith('message', 'type')
    })
  })
})