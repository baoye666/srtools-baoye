import { ASConfigMaze, AvatarConfigMaze, ConfigMaze, MOCConfigMaze, PFConfigMaze, SkillConfigMaze, StageConfigMaze } from '@/types';
import { create } from 'zustand'

interface MazeState {
    Technique: Record<string, AvatarConfigMaze>;
    MOC: Record<string, MOCConfigMaze>;
    AS: Record<string, ASConfigMaze>;
    PF: Record<string, PFConfigMaze>;
    Stage: Record<string, StageConfigMaze>;
    SkillTree: Record<string, SkillConfigMaze>;
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => void;
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => void;
    setAS: (newAS: Record<string, ASConfigMaze>) => void;
    setPF: (newPF: Record<string, PFConfigMaze>) => void;
    setStage: (newStage: Record<string, StageConfigMaze>) => void;
    setSkillTree: (newSkillTree: Record<string, SkillConfigMaze>) => void;
    setAllMazeData: (newData: ConfigMaze) => void;
}

const useMazeStore = create<MazeState>((set) => ({
    Technique: {},
    MOC: {},
    AS: {},
    PF: {},
    Stage: {},
    SkillTree: {},
    setSkillTree: (newSkillTree: Record<string, SkillConfigMaze>) => set({ SkillTree: newSkillTree }),
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => set({ Technique: newTechnique }),
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => set({ MOC: newMOC }),
    setAS: (newAS: Record<string, ASConfigMaze>) => set({ AS: newAS }),
    setPF: (newPF: Record<string, PFConfigMaze>) => set({ PF: newPF }),
    setStage: (newStage: Record<string, StageConfigMaze>) => set({ Stage: newStage }),
    setAllMazeData: (newData: ConfigMaze) => set({ 
        Technique: newData.Avatar, 
        MOC: newData.MOC, 
        AS: newData.AS, 
        PF: newData.PF, 
        Stage: newData.Stage,
        SkillTree: newData.Skill
    }),
}));

export default useMazeStore;