export interface MocDetail {
    Id: number
    Name: string
    GroupName: string
    Desc: string
    Param: number[]
    Challenge: ChallengeDetail[]
    Countdown: number
    DamageType1: string[]
    DamageType2: string[]
    MazeGroupID1: number
    MazeGroupID2: number
    NpcMonsterIDList1: number[]
    NpcMonsterIDList2: number[]
    EventIDList1: EventStageDetail[]
    EventIDList2: EventStageDetail[]
    BeginTime: string
    EndTime: string
}

export interface ChallengeDetail {
    Name: string
    Param?: number | null
}

export interface EventStageDetail {
    StageID: number
    StageType: string
    StageName: number
    HardLevelGroup: number
    Level: number
    EliteGroup?: number
    LevelGraphPath: string
    StageAbilityConfig: unknown[]
    BattleScoringGroup?: number | null
    SubLevelGraphs: unknown[]
    StageConfigData: StageConfig[]
    MonsterList: Record<string, number>[]
    LevelLoseCondition: string[]
    LevelWinCondition: string[]
    Release: boolean
    ForbidExitBattle: boolean
    MonsterWarningRatio?: number | null
    TrialAvatarList: unknown[]
}
export interface StageConfig {
    $type: string
    [key: string]: string
}

