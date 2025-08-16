import fetch from 'node-fetch';
import { ENDPOINTS } from '../config';

export async function getEquipmentList(): Promise<string[]> {
  const res = await fetch(ENDPOINTS.equipmentList);
  if (!res.ok)
    throw new Error(`Failed to fetch equipment list: ${res.statusText}`);
  return (await res.json()) as string[];
}
