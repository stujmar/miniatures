import { defineStore } from 'pinia'

// Dummy data for initial state
const dummyData = {
    miniatures: [
        {
            id: 1,
            name: "Space Marine Captain",
            image: "https://images.unsplash.com/photo-1600703136783-bdb5ea365239?w=400",
            notes: "Working on NMM gold trim and power sword effects",
            tags: ["Warhammer 40K", "Space Marines", "Character"],
            paints: [1, 2, 3],
            tutorials: [1],
            createdAt: "2024-03-30T10:00:00.000Z"
        },
        {
            id: 2,
            name: "Ancient Dragon",
            image: "https://preview.redd.it/i-found-the-perfect-dwarf-miniatures-highland-minis-it-is-v0-wmzya2gox8sc1.jpeg?width=1080&crop=smart&auto=webp&s=6152ef121a5dd1820684d41ec868c9f66fc3d862",
            notes: "Focus on scales and wing membrane texture",
            tags: ["Fantasy", "Dragon", "Large Monster"],
            paints: [4, 5],
            tutorials: [2],
            createdAt: "2024-03-29T15:30:00.000Z"
        }
    ],
    paints: [
        { id: 1, name: "Retributor Armour", brand: "Citadel", color: "#D4AF37" },
        { id: 2, name: "Macragge Blue", brand: "Citadel", color: "#0A3875" },
        { id: 3, name: "Leadbelcher", brand: "Citadel", color: "#595652" },
        { id: 4, name: "Mephiston Red", brand: "Citadel", color: "#9B1B1B" },
        { id: 5, name: "Abaddon Black", brand: "Citadel", color: "#1A1A1A" }
    ],
    materials: [
        { id: 1, name: "Fine Detail Brush", brand: "Windsor & Newton", type: "Brush" },
        { id: 2, name: "Plastic Glue", brand: "Tamiya", type: "Adhesive" }
    ],
    tutorials: [
        {
            id: 1,
            title: "Power Sword Effects Tutorial",
            url: "https://example.com/power-sword",
            description: "Learn how to paint power weapon effects",
            tags: ["Power Weapons", "OSL", "Advanced"]
        },
        {
            id: 2,
            title: "Dragon Scale Painting Guide",
            url: "https://example.com/dragon-scales",
            description: "Detailed guide for painting realistic dragon scales",
            tags: ["Scales", "Texture", "Advanced"]
        }
    ]
}

// Load initial state from localStorage
const loadState = () => {
    try {
        const state = JSON.parse(localStorage.getItem('miniatures-state'))
        return state || dummyData
    } catch {
        return dummyData
    }
}

export const useMiniatureStore = defineStore('miniatures', {
    state: () => loadState(),

    getters: {
        getMiniatureById: (state) => (id) => {
            return state.miniatures.find(m => m.id === id)
        },
        filteredMiniatures: (state) => (search = '', tags = []) => {
            return state.miniatures.filter(m => {
                const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
                const matchesTags = tags.length === 0 || tags.every(tag => m.tags.includes(tag))
                return matchesSearch && matchesTags
            })
        }
    },

    actions: {
        addMiniature(miniature) {
            this.miniatures.push({
                id: Date.now(),
                createdAt: new Date().toISOString(),
                ...miniature
            })
            this.saveState()
        },
        updateMiniature(id, updates) {
            const index = this.miniatures.findIndex(m => m.id === id)
            if (index !== -1) {
                this.miniatures[index] = { ...this.miniatures[index], ...updates }
                this.saveState()
            }
        },
        deleteMiniature(id) {
            this.miniatures = this.miniatures.filter(m => m.id !== id)
            this.saveState()
        },
        addPaint(paint) {
            this.paints.push(paint)
            this.saveState()
        },
        addMaterial(material) {
            this.materials.push(material)
            this.saveState()
        },
        addTutorial(tutorial) {
            this.tutorials.push(tutorial)
            this.saveState()
        },
        deleteTutorial(id) {
            this.tutorials = this.tutorials.filter(t => t.id !== id)
        },
        saveState() {
            localStorage.setItem('miniatures-state', JSON.stringify({
                miniatures: this.miniatures,
                paints: this.paints,
                materials: this.materials,
                tutorials: this.tutorials
            }))
        },
        setMiniatures(miniatures) {
            this.miniatures = miniatures;
        },
        setPaints(paints) {
            this.paints = paints;
        },
        setTutorials(tutorials) {
            this.tutorials = tutorials;
        }
    }
}) 