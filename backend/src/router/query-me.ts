import { t } from "../utils/trpc.js";

export const procedure = t.procedure.query(async ({ ctx }) => {
	return ctx.info.user;
});
