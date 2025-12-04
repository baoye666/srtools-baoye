import fs from 'fs';
import path from 'path';
import { MonsterDetail } from '@/types';
import { getMonsterDetailApi } from '../api';

const DATA_DIR = path.join(process.cwd(), 'data');
const monsterFileCache: Record<string, Record<string, MonsterDetail>> = {};
export let monsterMap: Record<string, MonsterDetail> = {};

function getJsonFilePath(locale: string): string {
  return path.join(DATA_DIR, `monster.${locale}.json`);
}

function loadFromFileIfExists(locale: string): Record<string, MonsterDetail> | null {
  if (monsterFileCache[locale]) return monsterFileCache[locale];

  const filePath = getJsonFilePath(locale);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, MonsterDetail>;
    monsterFileCache[locale] = data;
    return data;
  }
  return null;
}

export async function loadMonster(charIds: string[], locale: string): Promise<Record<string, MonsterDetail>> {
  const fileData = loadFromFileIfExists(locale);
  const fileIds = fileData ? Object.keys(fileData) : [];

  if (fileData && charIds.every(id => fileIds.includes(id))) {
    monsterMap = fileData;
    return monsterMap;
  }

  const result: Record<string, MonsterDetail> = {};

  await Promise.all(
    charIds.map(async id => {
      const info = await getMonsterDetailApi(Number(id), locale);
      if (info) result[id] = info;
    })
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = getJsonFilePath(locale);
  fs.writeFileSync(filePath, JSON.stringify(result), 'utf-8');

  monsterFileCache[locale] = result;
  monsterMap = result;
  return result;
}
