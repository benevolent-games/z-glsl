#!/usr/bin/env node

import {handleErrorsNicely} from "./internal/errors.js"
import {watchRoutine} from "./internal/watch-routine.js"
import {fileCompiler} from "./internal/file-compiler.js"
import {interpretCliArgs} from "./internal/interpret-cli-args.js"
import {deathWithDignity} from "./internal/tools/death-with-dignity.js"

deathWithDignity()

await handleErrorsNicely(async() => {
	const args = interpretCliArgs()
	const compiler = fileCompiler(args)

	if (args.watch)
		watchRoutine({
			...args,
			whenAnyFileChanges: () => compiler.compileAndWriteDirectoryDebounced(),
		})
	else
		await compiler.compileAndWriteDirectory()
})
