export const listCurrentLanguage = {
    ja: "JP",
    ko: "KR",
    en: "US",
    vi: "VN",
    zh: "CN"
};

export const listCurrentLanguageApi : Record<string, string> = {
    ja: "jp",
    ko: "kr",
    en: "en",
    vi: "en",
    zh: "cn"
};

export const mappingStats = <Record<string, {name: string, icon: string, unit: string, baseStat: string}> > {
    "HPDelta": {
        name:"HP",
        icon:"/icon/hp.webp",
        unit: "",
        baseStat: "HP"
    },
    "AttackDelta": {
        name:"ATK",
        icon:"/icon/attack.webp",
        unit: "",
        baseStat: "ATK"
    },
    "HPAddedRatio": {
        name:"HP",
        icon:"/icon/hp.webp",
        unit: "%",
        baseStat: "HP"
    },
    "AttackAddedRatio": {
        name:"ATK",
        icon:"/icon/attack.webp",
        unit: "%",
        baseStat: "ATK"
    },
    "DefenceDelta": {
        name:"DEF",
        icon:"/icon/defence.webp",
        unit: "",
        baseStat: "DEF"
    },
    "DefenceAddedRatio": {
        name:"DEF",
        icon:"/icon/defence.webp",
        unit: "%",
        baseStat: "DEF"
    },
    "SpeedAddedRatio": {
        name:"SPD",
        icon:"/icon/speed.webp",
        unit: "%",
        baseStat: "SPD"
    },
    "BaseSpeed": {
        name:"SPD",
        icon:"/icon/speed.webp",
        unit: "",
        baseStat: "SPD"
    },
    "CriticalChanceBase": {
        name:"CRIT Rate",
        icon:"/icon/crit-rate.webp",
        unit: "%",
        baseStat: "CRITRate"
    },
    "CriticalDamageBase": {
        name:"CRIT DMG",
        icon:"/icon/crit-damage.webp",
        unit: "%",
        baseStat: "CRITDmg"
    },
    "HealRatioBase": {
        name:"Outgoing Healing Boost",
        icon:"/icon/healing-boost.webp",
        unit: "%",
        baseStat: "HealBoost"
    },
    "StatusProbabilityBase": {
        name:"Effect Hit Rate",
        icon:"/icon/effect-hit-rate.webp",
        unit: "%",
        baseStat: "EffectHitRate"
    },
    "StatusResistanceBase": {
        name:"Effect RES",
        icon:"/icon/effect-res.webp",
        unit: "%",
        baseStat: "EffectRES"
    },
    "BreakDamageAddedRatioBase": {
        name:"Break Effect",
        icon:"/icon/break-effect.webp",
        unit: "%",
        baseStat: "BreakEffect"
    },
    "SpeedDelta": {
        name:"SPD",
        icon:"/icon/speed.webp",
        unit: "",
        baseStat: "SPD"
    },
    "PhysicalAddedRatio": {
        name:"Physical DMG Boost",
        icon:"/icon/physical-add.webp",
        unit: "%",
        baseStat: "PhysicalAdd"
    },
    "FireAddedRatio": {
        name:"Fire DMG Boost",
        icon:"/icon/fire-add.webp",
        unit: "%",
        baseStat: "FireAdd"
    },
    "IceAddedRatio": {
        name:"Ice DMG Boost",
        icon:"/icon/ice-add.webp",
        unit: "%",
        baseStat: "IceAdd"
    },
    "ThunderAddedRatio": {
        name:"Thunder DMG Boost",
        icon:"/icon/thunder-add.webp",
        unit: "%",
        baseStat: "ThunderAdd"
    },
    "WindAddedRatio": {
        name:"Wind DMG Boost",
        icon:"/icon/wind-add.webp",
        unit: "%",
        baseStat: "WindAdd"
    },
    "QuantumAddedRatio": {
        name:"Quantum DMG Boost",
        icon:"/icon/quantum-add.webp",
        unit: "%",
        baseStat: "QuantumAdd"
    },
    "ImaginaryAddedRatio": {
        name:"Imaginary DMG Boost",
        icon:"/icon/imaginary-add.webp",
        unit: "%",
        baseStat: "ImaginaryAdd"
    },
    "ElationDamageAddedRatioBase": {
        name:"Elation DMG Boost",
        icon:"/icon/IconJoy.webp",
        unit: "%",
        baseStat: "ElationAdd"
    },
    "SPRatioBase": {
        name:"Energy Regeneration Rate",
        icon:"/icon/energy-rate.webp",
        unit: "%",
        baseStat: "EnergyRate"
    }
}


export const ratioStats = [
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "SpeedAddedRatio",
]



export const themeColors: Record<string, { bg: string; bgHover: string; text: string; border: string }> = {
  winter: {
    bg: '#ffffff',
    bgHover: '#f1f5f9',
    text: '#3a4f6b',
    border: '#cbd5e1'
  },
  night: {
    bg: '#1d232a',
    bgHover: '#2a323c',
    text: '#cbcdd1',
    border: '#3f3f46'
  },
  cupcake: {
    bg: '#faf7f5',
    bgHover: '#f3eae6',
    text: '#281333',
    border: '#e5d3cb'
  },
  coffee: {
    bg: '#20161f',
    bgHover: '#2a1d29',
    text: '#c4a051',
    border: '#3a2a36'
  }
}
