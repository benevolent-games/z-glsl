
import {err} from "./errors.js"
import {ezargs} from "./tools/ezargs.js"

export function interpretCliArgs() {
	const {flags, args: [source, destination]} = ezargs()

	let {
		"--watch": watch,
		"--verbose": verbose,
		"--poll": poll,
	} = Object.fromEntries(flags.entries())

	if (watch)
		verbose = "true"

	if (!source)
		err(22, "source path is required (it should be the 1st argument)")

	if (!destination)
		err(22, "destination path is required (it should be the 2nd argument)")

	return {
		source,
		destination,
		watch,
		verbose,
		poll,
	}
}
