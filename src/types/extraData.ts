export interface ExtraData {
    theory_craft: {
        hp: Record<string, number[]>
        cycle_count: number
        mode: boolean
    }
    setting: {
        censorship: boolean
        cm: boolean
        first_person: boolean
        hide_ui: boolean
    };
}
