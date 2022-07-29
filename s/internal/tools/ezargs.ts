
export function ezargs([,, ...raw]: string[] = process.argv) {
	const flags = new Map<string, string>()
	const args: string[] = []

	for (const arg of raw) {
		if (arg.startsWith("--")) {
			const [key, content] = arg.split("=")
			flags.set(key, content ?? "true")
		}
		else {
			args.push(arg)
		}
	}

	return {flags, args}
}
