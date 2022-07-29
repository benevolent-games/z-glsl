
import {err} from "./errors.js"

export function makeCompiler({dirname, read, resolve}: {
		dirname: (path: string) => string
		read: (path: string) => Promise<string>
		resolve: (a: string, ...b: string[]) => string
	}) {

	async function compile(path: string) {
		const loading = new Set<string>()
		const included = new Map<string, string>()

		async function recurse(path: string): Promise<string | undefined> {
			if (loading.has(path))
				err(-40, `circular import of "${path}"`)
			if (included.has(path))
				return undefined

			loading.add(path)
			const zglsl = await read(path)
			const lines = zglsl.split("\n")
			const data: string[] = []

			for (const line of lines) {
				const importDirective = line.match(/^[#@]import\s+([^;]+);?$/i)
				if (importDirective) {
					const [, relativeImportPath] = importDirective
					const absoluteImportPath = resolve(dirname(path), relativeImportPath)
					const compiled = await recurse(absoluteImportPath)
					if (compiled)
						data.push(compiled)
				}
				else
					data.push(line)
			}

			loading.delete(path)
			const final = data.join("\n")
			included.set(path, final)
			return final
		}

		let glsl = ""
		try {
			glsl = <string>await recurse(resolve(path))
		}
		catch (error: any) {
			if (error.code === "ENOENT")
				err(-2, `file not found "${path}"`)
			else
				throw error
		}

		return glsl
	}

	return {compile}
}
