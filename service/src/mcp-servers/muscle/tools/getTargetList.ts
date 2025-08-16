import fetch from 'node-fetch';
import { ENDPOINTS } from '../config';

export async function getTargetList(): Promise<string[]> {
  const res = await fetch(ENDPOINTS.targetList);
  if (!res.ok)
    throw new Error(`Failed to fetch target muscles: ${res.statusText}`);
  return (await res.json()) as string[];
}
