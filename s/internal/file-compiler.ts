
import {glob} from "./tools/glob.js"
import {dirname, join, resolve, relative} from "path"
import {readFile, writeFile, mkdir} from "fs/promises"
import {interpretCliArgs} from "./interpret-cli-args.js"
import {compilationSession} from "./compilation-session.js"
import {debounce} from "@chasemoskal/magical/x/toolbox/debounce/debounce.js"

export function fileCompiler({
		source,
		verbose,
		destination,
	}: ReturnType<typeof interpretCliArgs>) {

	const session = compilationSession({
		dirname,
		resolve,
		read: (path: string) => readFile(path, "utf-8"),
	})

	async function compileAndWriteFile(path: string) {
		const glsl = await session.compile(path)
		const subpath = relative(resolve(source), resolve(path))
		const writepath = `${destination}/${subpath}`
		await mkdir(dirname(writepath), {recursive: true})
		await writeFile(writepath, glsl, "utf-8")
		if (verbose)
			console.log("✔ " + writepath)
	}

	async function compileAndWriteDirectory() {
		const paths = await glob(join(source, "**/*.z.glsl"))
		for (const path of paths) {
			await compileAndWriteFile(path)
		}
	}

	const compileAndWriteDirectoryDebounced = debounce(
		100,
		compileAndWriteDirectory
	)

	return {
		compileAndWriteFile,
		compileAndWriteDirectory,
		compileAndWriteDirectoryDebounced,
	}
}
