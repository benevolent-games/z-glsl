
import chalk from "chalk"

export class ZGlslError extends Error {
	name = this.constructor.name
	constructor(public errno: number, message: string) {
		super(
			chalk.redBright("✘ ")
			+ chalk.yellow("Z-GLSL-ERROR! ")
			+ chalk.red(message)
		)
	}
}

export function err(errno: number, message: string) {
	throw new ZGlslError(errno, message)
}
