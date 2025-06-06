<script setup>
// eslint-disable-next-line
  import { onMounted, ref, defineProps, defineEmits } from 'vue'

  // Components
  import GuideStep from '../components/GuideStep.vue'
  import GuideOptions from '../components/GuideOptions.vue'
  import GuideNavigation from '../components/GuideNavigation.vue'

  // API
  import { useSearchApiClient } from '../composables/useSearchApiClient'
  import { useGuideSteps } from '../composables/useGuideSteps'
  import { getGuideElement } from '@/shared/services/guideService'

  const props = defineProps({
    guideId: String
  })

  const emit = defineEmits(['back'])

  function goBack() {
    emit('back') // triggers the back function in parent
  }

  const api = useSearchApiClient()

  const guide = ref({ title: '', opCodes: [], steps: [] })
  const { currentStep, prevStep, goToStep } = useGuideSteps(guide)

  const loading = ref(true)
  const error = ref(false)

  onMounted(async () => {
      try {
        const { data } = await getGuideElement(api, props.guideId)
        guide.value = data
        currentStep.value = data.steps[0] || null
      } catch (e) {
        console.error(e)
        error.value = true
      } finally {
        loading.value = false
      }
  })

</script>

<template>
  <div v-if="loading" class="text-muted">Bitte warten...</div>
  <div v-else-if="error" class="alert alert-danger">Guide konnte nicht geladen werden.</div>
  <div v-else-if="guide.steps.length === 0"> <!-- is displayed if no steps have been configured for the guide but the operation-code has already been assigned -->
    <div class="alert alert-info mt-3">
      Für diesen Operation-Code sind noch keine Leitlinien hinterlegt.
    </div>
    <button class="btn btn-light me-2" @click="goBack">Zurück zur Suche</button>
  </div>
  <div v-else-if="currentStep">
    <h3>{{ guide.title }}</h3>

    <GuideStep
        :questionTitle="currentStep.questionTitle"
        :description="currentStep.description"
    />

    <GuideOptions
        :options="currentStep.options || []"
        @select="goToStep"
    />

    <!-- !! => compact version of if (x !== null && x === true) -->
    <GuideNavigation
        :hasPrev="!!prevStep"
        :onBackToSearch="() => goBack()"
        :onGoBack="() => goToStep(prevStep)"
    />
  </div>
</template>