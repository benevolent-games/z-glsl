
import {join} from "path"
import chokidar from "chokidar"
import {ZGlslError} from "./errors.js"
import {interpretCliArgs} from "./interpret-cli-args.js"

const events = [
	"add",
	"change",
	"unlink",
]

export function watchRoutine({
		poll,
		source,
		destination,
		whenAnyFileChanges,
	}: {
		whenAnyFileChanges: () => Promise<void>
	} & ReturnType<typeof interpretCliArgs>) {

	console.log(`👁️ watching .z.glsl changes under "${source}" to compile into "${destination}"`)

	if (poll)
		console.log("♻️ polling for changes")

	const watcher = chokidar.watch(
		join(source, "**/*.glsl"),
		{
			cwd: process.cwd(),
			usePolling: !!poll,
		}
	)

	for (const event of events) {
		watcher.on(event, async(path: string) => {
			try {
				console.log(`🡢 ${path}`)
				await whenAnyFileChanges()
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
