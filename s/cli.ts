
import chokidar from "chokidar"
import {glob} from "./internal/tools/glob.js"
import {ezargs} from "./internal/tools/ezargs.js"
import {err, ZGlslError} from "./internal/errors.js"
import {dirname, join, resolve, relative} from "path"
import {readFile, writeFile, mkdir} from "fs/promises"
import {makeCompiler} from "./internal/make-compiler.js"
import {deathWithDignity} from "./internal/tools/death-with-dignity.js"
import {debounce} from "@chasemoskal/magical/x/toolbox/debounce/debounce.js"

deathWithDignity()
const {flags, args: [source, destination]} = ezargs()
let {"--watch": watch, "--verbose": verbose} = Object.fromEntries(flags.entries())

if (watch)
	verbose = "true"

try {
	if (!source)
		err(22, "source path is required (it should be the 1st argument)")

	if (!destination)
		err(22, "destination path is required (it should be the 2nd argument)")

	const zglsl = makeCompiler({
		dirname,
		resolve,
		read: (path: string) => readFile(path, "utf-8"),
	})

	async function compileSingleFile(path: string) {
		const glsl = await zglsl.compile(path)
		const subpath = relative(resolve(source), resolve(path))
		const writepath = `${destination}/${subpath}`
		await mkdir(dirname(writepath), {recursive: true})
		await writeFile(writepath, glsl, "utf-8")
		if (verbose)
			console.log("✔ " + writepath)
	}

	async function fullCompilationOfSourceToDestination() {
		const paths = await glob(join(source, "**/*.z.glsl"))
		for (const path of paths) {
			await compileSingleFile(path)
		}
	}

	const debouncedCompilation = debounce(100, fullCompilationOfSourceToDestination)

	if (watch) {
		console.log(`👁️ watching .z.glsl changes under "${source}" to compile into "${destination}"`)
		const watcher = chokidar.watch(join(source, "**/*.glsl"), {cwd: process.cwd()})
		for (const event of [
			"add",
			"change",
			"unlink",
		]) {
			watcher.on(event, async(path: string) => {
				try {
					console.log(`🡢 ${path}`)
					await debouncedCompilation()
				}
				catch (error) {
					if (error instanceof ZGlslError)
						console.error(error.message)
					else
						throw error
				}
			})
		}
	}
	else {
		await fullCompilationOfSourceToDestination()
	}
}
catch (error) {
	if (error instanceof ZGlslError) {
		console.error(error.message)
		process.exit(error.errno)
	}
	else
		throw error
}
