/**
 * Identity function that enables Tailwind CSS IntelliSense
 *  for class strings outside of `tv()`/`cn()` calls.
 */
export function tw(...classes: Array<string>): string {
	return classes.join(" ");
}
