let open = $state(false);

export const sidebar = {
	get open() {
		return open;
	},
	toggle() {
		open = !open;
	}
};
