export interface PFGroupDetail {
    ID: number;
    ChallengeGroupType: string;
    Name: Record<string, string>;
    BeginTime: string;
    EndTime: string;
    SubOption: MazeBuff[];
    Option: MazeBuff[];
    Level: LevelData[];
}

export interface MazeBuff {
    ID: number;
    Param: number[];
    Icon: string;
    Name: Record<string, string>;
    Desc: Record<string, string>;
}

export interface LevelData {
    Floor: number;
    ID: number;
    StageNum: number;
    Name: Record<string, string>;
    Target: StoryTarget[];
    DamageType1: string[];
    DamageType2: string[];
    MazeBuff: MazeBuff[];
    EventList1: StageConfig[];
    EventList2: StageConfig[];
    TurnLimit: number;
    BattleTarget: BattleTarget[];
    ClearScore: number;
}

export interface StoryTarget {
    ID: number;
    Name: Record<string, string>;
    Param: number[];
}

export interface BattleTarget {
    ID: number;
    Param: number[];
    Name: Record<string, string>;
}

export interface StageConfig {
    ID: number;
    Name: Record<string, string>;
    HardLevelGroup: number;
    EliteGroup: number;
    Level: number;
    Release: boolean;
    MonsterList: number[][];
    Infinite?: InfiniteWave[] | null;
}

export interface InfiniteWave {
    ID: number;
    MaxMonsterCount: number;
    MonsterList: number[];
    EliteGroup: number;
}