
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

export function handleErrorsNicely<T>(fun: () => T): T {
	try {
		return fun()
	}
	catch (error) {
		if (error instanceof ZGlslError) {
			console.error(error.message)
			process.exit(error.errno)
		}
		else
			throw error
	}
}
