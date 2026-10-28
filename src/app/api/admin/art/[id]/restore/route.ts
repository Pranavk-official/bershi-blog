import { toggleHidden } from "../toggle";

/** Undoes a soft delete. */
export function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return toggleHidden(params, false);
}
