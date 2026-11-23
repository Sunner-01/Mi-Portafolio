/** Normalized scroll stops shared by DOM text, chapter navigation and the 3D rig. */
export const CHAPTER_STOPS = [0.28, 0.6, 0.9] as const;
export const CHAPTER_BOUNDARIES = [0.16, 0.46, 0.77] as const;
export function chapterAt(progress: number): number {
  if (progress < CHAPTER_BOUNDARIES[0]) return -1;
  if (progress < CHAPTER_BOUNDARIES[1]) return 0;
  if (progress < CHAPTER_BOUNDARIES[2]) return 1;
  return 2;
}
export const ARRIVAL_EASE = [0.16, 1, 0.3, 1] as const;
