import fetch from 'node-fetch';
import { ENDPOINTS } from '../config';

export async function getBodyPartList(): Promise<string[]> {
  const res = await fetch(ENDPOINTS.bodyPartList);
  if (!res.ok) throw new Error(`Failed to fetch body parts: ${res.statusText}`);
  return (await res.json()) as string[];
}
