// `page-flip` ships no types. Declare only the API actually used.
declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    flipNext(): void;
    flipPrev(): void;
    update(): void;
    on(event: "flip", callback: (e: { data: number }) => void): this;
    destroy(): void;
  }
}
