<template>
  <div>
    <div class="grid grid-cols-3 p-4 gap-x-8">
      <LabelledCard
        v-for="(pipeline, index) in pipelines"
        :key="index"
        :title="pipeline.title"
        :description="pipeline.description"
      >
        <TractionLink
          v-for="(route, inner_index) in pipeline.routes"
          :key="inner_index"
          :name="humanise(route)"
          :link="`/${pipeline.name}/${route}`"
        />
      </LabelledCard>
    </div>
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import LabelledCard from '@/components/LabelledCard'
import TractionLink from '@/components/TractionLink'

export default {
  name: 'TractionDashboard',
  components: {
    LabelledCard,
    TractionLink,
  },
  computed: {
    pipelines: () => PipelinesConfig,
  },
  methods: {
    humanise,
  },
}
</script>

<style scoped lang="scss"></style>
