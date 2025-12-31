import { procedure } from "../utils/trpc.js";

export const p = procedure.query(async ({ ctx }) => {
	return ctx.info.user;
});
