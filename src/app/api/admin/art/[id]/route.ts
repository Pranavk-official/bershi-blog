import { toggleHidden } from "./toggle";

/** Soft delete: hides the piece from the site. POST ./restore brings it back. */
export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return toggleHidden(params, true);
}
