// `page-flip` ships no types. Declare only the API actually used.
declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    flipNext(): void;
    flipPrev(): void;
    update(): void;
    /** Instant, no animation. */
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    /** Ends a drag as if the pointer were released at `pos` (page-flip's own coordinates). */
    userStop(pos: { x: number; y: number }, isSwipe?: boolean): void;
    on(event: "flip", callback: (e: { data: number }) => void): this;
    destroy(): void;
  }
}
