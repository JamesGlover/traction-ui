import { mount, localVue, store } from '../../testHelper'
import PacbioRunInfo from '@/components/pacbio/PacbioRunInfo'
import * as Run from '@/api/PacbioRun'

describe('PacbioRunInfo', () => {

    let wrapper, runInfo, run

    beforeEach(() => {
        run = Run.build()

        store.commit('traction/pacbio/runs/setCurrentRun', run)

        // TODO: need to work out how to use attachTo properly.
        // attachDocument is deprecated.
        wrapper = mount(PacbioRunInfo, { localVue, store, sync: false, attachToDocument: true })
        runInfo = wrapper.vm

    })

    it('can have mapState', () => {
        expect(runInfo.bindingKitBoxBarcode).toBeDefined()
        expect(runInfo.sequencingKitBoxBarcode).toBeDefined()
        expect(runInfo.dnaControlComplexBoxBarcode).toBeDefined()
        expect(runInfo.comments).toBeDefined()
        expect(runInfo.systemName).toBeDefined()
    })

    it('can have getters', () => {
        expect(runInfo.currentRun).toBeDefined()
    })

    it('must have systemName data', () => {
        expect(runInfo.systemNameOptions).toEqual([{ text: 'System Name', value: "" }, 'Sequel I', 'Sequel II'])
    })

    describe('form inputs', () => {
        it('Run name should be read only', () => {
            let input = wrapper.find('#run_name')
            expect(input.attributes('readonly')).toBeTruthy()
        })
        it('has a Binding Kit Box Barcode input', () => {
            expect(wrapper.find('#binding_kit_box_barcode')).toBeDefined()
        })
        it('has a Sequencing Kit Box Barcode input', () => {
            expect(wrapper.find('#sequencing_kit_box_barcode')).toBeDefined()
        })
        it('has a DNA Control Complex Box Barcode input', () => {
            expect(wrapper.find('#dna_control_complex_box_barcode')).toBeDefined()
        })
        it('has a System Name input', () => {
            expect(wrapper.find('#system_name')).toBeDefined()
        })
        it('has a Comments input', () => {
            expect(wrapper.find('#comments')).toBeDefined()
        })
    })

    afterEach(() => {
        wrapper.destroy()
    })
})
