
import legacyGlob from "glob"

export async function glob(s: string) {
	return new Promise<string[]>((resolve, reject) => {
		legacyGlob.glob(s, (error, matches) => {
			if (error)
				reject(error)
			else
				resolve(matches)
		})
	})
}
