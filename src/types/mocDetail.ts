import { InfiniteWave, MazeBuff } from "./pfDetail";

export interface MOCGroupDetail {
    ID: number;
    ChallengeGroupType: string;
    Name: Record<string, string>;
    Image: MoCImage;
    BeginTime: string;
    EndTime: string;
    Level: MoCLevel[];
}

export interface MoCImage {
    BackGroundPath: string;
    TabPicPath: string;
    TabPicSelectPath: string;
    ThemePicPath: string;
}

export interface MoCLevel {
    Floor: number;
    ID: number;
    StageNum: number;
    Name: Record<string, string>;
    Target: MoCTarget[];
    TurnLimit: number;
    DamageType1: string[];
    DamageType2: string[];
    MazeBuff: MazeBuff[];
    EventList1: MoCEvent[];
    EventList2: MoCEvent[];
}

export interface MoCTarget {
    ID: number;
    Name: Record<string, string>;
    Param: number[];
}

export interface MoCEvent {
    ID: number;
    Name: Record<string, string>;
    HardLevelGroup: number;
    EliteGroup: number;
    Level: number;
    Release: boolean;
    MonsterList: number[][];
    Infinite: InfiniteWave[] | null;
}