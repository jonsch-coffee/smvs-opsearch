import { defineStore } from 'pinia'

/**
 * Pinia-Store that stores global variables
 * @type {StoreDefinition<"guide", {allGuides: [], selectedGuideId: string, guide: {id: string, title: string, steps: [], opCodes: []}, lastSavedAt: null, saveFailed: null}, {guideSteps(*): [], selectedGuide(*): *}, {setAllGuides(*): void, selectGuideById(*): void, updateGuideLocally(*): void, createNewGuide(*): void, deleteGuide(): void, removeStepById(*): void}>}
 */
export const useGuideStore = defineStore('guide', {
    state: () => ({
        allGuides: [],
        selectedGuideId: '',
        guide: {
            id: '',
            title: '',
            steps: [],
            opCodes: []
        },
        lastSavedAt: null,
        saveFailed: null,
    }),

    getters: {
        guideSteps(state) {
            return state.guide.steps
        },
        selectedGuide(state) {
            return state.allGuides.find(g => g.id === state.selectedGuideId)
        }
    },

    actions: {
        setAllGuides(guides) {
            this.allGuides = guides
        },

        selectGuideById(id) {
            const selected = this.allGuides.find(g => g.id === id)
            if (!selected) return
            Object.assign(this.guide, selected)
            this.selectedGuideId = id
        },

        updateGuideLocally(guideData) {
            const index = this.allGuides.findIndex(g => g.id === guideData.id)
            if (index !== -1) {
                Object.assign(this.allGuides[index], guideData)
            }
        },

        createNewGuide(newGuide) {
            this.allGuides.push(newGuide)
            Object.assign(this.guide, newGuide)
            this.selectedGuideId = newGuide.id
        },

        deleteGuide() {
            if (!this.selectedGuideId) return
            this.allGuides = this.allGuides.filter(g => g.id !== this.selectedGuideId)
            this.guide = { id: '', title: '', steps: [], opCodes: [] }
            this.selectedGuideId = null
        },

        removeStepById(stepId) {
            this.guide.steps = this.guide.steps.filter(s => s.id !== stepId)
        }
    }
})