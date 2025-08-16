export const parseGPTJSON = (raw: string) => {
  const cleaned = raw
    .replace(/```json\s*/, '')
    .replace(/```/g, '')
    .trim();
  return JSON.parse(cleaned);
};
