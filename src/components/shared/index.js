import FlaggedFeature from '@/components/shared/FlaggedFeature'
import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal'
import TractionButton from '@/components/shared/TractionButton'
import TractionFieldset from '@/components/shared/TractionFieldset'
import TractionInputGroup from '@/components/shared/TractionInputGroup'
import TractionSection from '@/components/shared/TractionSection'
import TractionHeading from '@/components/TractionHeading'
import TractionMenu from '@/components/shared/TractionMenu'
import TractionMenuItem from '@/components/shared/TractionMenuItem'

const registerGlobal = (vue) => {
  vue.component('FlaggedFeature', FlaggedFeature)
  vue.component('LoadingFullScreenModal', LoadingFullScreenModal)
  vue.component('TractionButton', TractionButton)
  vue.component('TractionFieldset', TractionFieldset)
  vue.component('TractionInputGroup', TractionInputGroup)
  vue.component('TractionSection', TractionSection)
  vue.component('TractionHeading', TractionHeading)
  vue.component('TractionMenu', TractionMenu)
  vue.component('TractionMenuItem', TractionMenuItem)
}

export { registerGlobal }
