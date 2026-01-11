/* eslint-disable @typescript-eslint/no-explicit-any */
import { AffixDetail, ASDetail, ChangelogItemType, CharacterDetail, ConfigMaze, FreeSRJson, LightConeDetail, MocDetail, MonsterDetail, PeakDetail, PFDetail, PSResponse, RelicDetail } from "@/types";
import axios from 'axios';
import { psResponseSchema } from "@/zod";
import { ExtraData } from "@/types";

export async function getConfigMazeApi(): Promise<ConfigMaze> {
    try {
        const res = await axios.get<ConfigMaze>(`/data/config_maze.json`);
        return res.data as ConfigMaze;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {
            Avatar: {},
            MOC: {},
            AS: {},
            PF: {},
            Stage: {},
        };
    }
}

export async function getMainAffixApi(): Promise<Record<string, Record<string, AffixDetail>>> {
    try {
        const res = await axios.get<Record<string, Record<string, AffixDetail>>>(`/data/main_affixes.json`);
        return res.data as Record<string, Record<string, AffixDetail>>;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {};
    }
}

export async function getSubAffixApi(): Promise<Record<string, Record<string, AffixDetail>>> {
    try {
        const res = await axios.get<Record<string, Record<string, AffixDetail>>>(`/data/sub_affixes.json`);

        return res.data as Record<string, Record<string, AffixDetail>>;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {};
    }
}

export async function fetchCharactersApi(locale: string): Promise<Record<string, CharacterDetail>> {
    try {
        const res = await axios.get<Record<string, CharacterDetail>>(`/data/characters.${locale}.json`);
        const resIcon = await axios.get<Record<string, string[]>>(`/data/rank_icon.json`);
        for (const [key, char] of Object.entries(res.data)) {
            if (resIcon.data[key]) {
                char.RankIcon = resIcon.data[key];
            }
        }
        return res.data;
    } catch (error) {
        console.error('Failed to fetch characters:', error);
        return {};
    }
}

export async function fetchLightconesApi(locale: string): Promise<Record<string, LightConeDetail>> {
    try {
        const res = await axios.get<Record<string, LightConeDetail>>(`/data/lightcones.${locale}.json`);
        const resBonus = await axios.get<Record<string, Record<string, { type: string, value: number }[]>>>('/data/lightcone_bonus.json');
        for (const [key, relic] of Object.entries(res.data)) {
            if (resBonus.data[key]) {
                relic.Bonus = resBonus.data[key];
            }
        }
        return res.data;
    } catch (error) {
        console.error('Failed to fetch lightcones:', error);
        return {};
    }
}

export async function fetchRelicsApi(locale: string): Promise<Record<string, RelicDetail>> {
    try {
        const res = await axios.get<Record<string, RelicDetail>>(`/data/relics.${locale}.json`);
        const resBonus = await axios.get<Record<string, Record<string, { type: string, value: number }[]>>>('/data/relic_bonus.json');
        for (const [key, relic] of Object.entries(res.data)) {
            if (resBonus.data[key]) {
                relic.Bonus = resBonus.data[key];
            }
        }
        return res.data;
    } catch (error) {
        console.error('Failed to fetch relics:', error);
        return {};
    }
}

export async function fetchASEventApi(locale: string): Promise<Record<string, ASDetail> | null> {
    try {
        const res = await axios.get<Record<string, ASDetail>>(`/data/as.${locale}.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch AS:', error);
        return null;
    }
}

export async function fetchPFEventApi(locale: string): Promise<Record<string, PFDetail> | null> {
    try {
        const res = await axios.get<Record<string, PFDetail>>(`/data/pf.${locale}.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch PF:', error);
        return null;
    }
}

export async function fetchMOCEventApi(locale: string): Promise<Record<string, MocDetail[]> | null> {
    try {
        const res = await axios.get<Record<string, MocDetail[]>>(`/data/moc.${locale}.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch MOC:', error);
        return null;
    }
}

export async function fetchPeakEventApi(locale: string): Promise<Record<string, PeakDetail> | null> {
    try {
        const res = await axios.get<Record<string, PeakDetail>>(`/data/peak.${locale}.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch peak:', error);
        return null;
    }
}

export async function fetchMonstersApi(locale: string): Promise<Record<string, MonsterDetail> | null> {
    try {
        const res = await axios.get<Record<string, MonsterDetail>>(`/data/monsters.${locale}.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch monster:', error);
        return null;
    }
}

export async function fetchChangelog(): Promise<ChangelogItemType[] | null> {
    try {
        const res = await axios.get<ChangelogItemType[]>(`/data/changelog.json`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch monster:', error);
        return null;
    }
}

export async function SendDataToServer(
    username: string,
    password: string,
    serverUrl: string,
    data: FreeSRJson | null,
    extraData?: ExtraData
): Promise<PSResponse | string> {
    try {
        const response = await axios.post(`${serverUrl}`, { username, password, data, extra_data: extraData })
        const parsed = psResponseSchema.safeParse(response.data)
        if (!parsed.success) {
            return "Invalid response schema";
        }
        return parsed.data;
    } catch (error: any) {
        return error?.message || "Unknown error";
    }
}

export async function SendDataThroughProxy({ data }: { data: any }) {
    try {
        const response = await axios.post(`/api/proxy`, { ...data })
        return response.data;
    } catch (error: any) {
        return error;
    }
}