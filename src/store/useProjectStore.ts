import { create } from "zustand"

interface Project {
    id: number,
    name: string
}

interface ProjectState {
    project: Project | null,
    setProject: (projectInfo: Project) => void
}

const useProjectStore = create<ProjectState>((set) => ({
    project: null,
    setProject: (projectInfo) => {
        set({project: projectInfo})
    }
}))

export default useProjectStore;