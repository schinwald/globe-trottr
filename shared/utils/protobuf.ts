export * from "@bufbuild/protobuf";

import {
	timestampDate as protoDate,
	timestampFromDate as protoTimestamp,
	type Timestamp,
} from "@bufbuild/protobuf/wkt";

export type { Timestamp } from "@bufbuild/protobuf/wkt";

export const timestampFromDate = (date?: Date | null | undefined) => {
	if (!date) return undefined;
	return protoTimestamp(date);
};

export const dateFromTimestamp = (timestamp?: Timestamp | null | undefined) => {
	if (!timestamp) return undefined;
	return protoDate(timestamp);
};
