export interface MonsterDetail {
    Id: number
    Name: string
    Desc: string
    MonsterCampID: number | null
    AttackBase: number
    CriticalDamageBase: number
    DefenceBase: number
    HPBase: number
    InitialDelayRatio: number
    ImagePath: string
    MinimumFatigueRatio: number
    Rank: string
    SpeedBase: number
    StanceBase: number
    StanceCount: number
    StatusResistanceBase: number
    Child: MonsterDetailChild[]
    Drop: MonsterDetailDrop[]
}

export interface MonsterDetailChild {
    Id: number
    AttackModifyRatio: number
    DefenceModifyRatio: number
    EliteGroup: number
    HPModifyRatio: number
    SpeedModifyRatio: number
    SpeedModifyValue: number | null
    StanceModifyRatio: number
    StanceWeakList: string[]
    HardLevelGroup: number
    DamageTypeResistance: MonsterDetailElementResistance[]
    SkillList: MonsterDetailSkill[]
}

export interface MonsterDetailElementResistance {
    $type: string
    DamageType: string
    Value: number
}

export interface MonsterDetailSkill {
    Id: number
    SkillName: string | null
    SkillDesc: string | null
    DamageType: string
    SPHitBase: number | string
}

export interface MonsterDetailDrop {
    MonsterTemplateID: number
    WorldLevel?: number
    AvatarExpReward: number
    DisplayItemList: MonsterDetailDropItem[]
}

export interface MonsterDetailDropItem {
    $type: string
    ID: number
}
