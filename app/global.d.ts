import "little-state-machine";

declare module "little-state-machine" {
	interface GlobalState {
		build: {
			name: string;
			title: string;
		};
	}
}
