import type { GlobalState } from "little-state-machine";

export function updateName(
	state: GlobalState,
	payload: {
		name: string;
	},
) {
	return {
		...state,
		build: {
			...state.build,
			...payload,
		},
	};
}

export function updateTitle(
	state: GlobalState,
	payload: {
		title: string;
	},
) {
	return {
		...state,
		build: {
			...state.build,
			...payload,
		},
	};
}
