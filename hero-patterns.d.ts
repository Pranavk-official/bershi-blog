// `hero-patterns` ships no types. Declare only the patterns actually used —
// each returns a `url("data:image/svg+xml,…")` string for `background-image`.
declare module "hero-patterns" {
  export type HeroPattern = (fill?: string, opacity?: number) => string;

  export const topography: HeroPattern;
  export const bamboo: HeroPattern;
  export const leaf: HeroPattern;
  export const wiggle: HeroPattern;
  export const glamorous: HeroPattern;
  export const moroccan: HeroPattern;
  export const overlappingCircles: HeroPattern;
  export const jigsaw: HeroPattern;
}
