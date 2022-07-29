
🦓 z-glsl
=========

*glsl preprocessor cli*

📂 use imports in your glsl: `#import path/to/file.glsl`  
🧐 now you can organize your code  
📝 files with the `.z.glsl` extension get compiled  
🤷‍♂️ that's all for now  
💖 free and open source, just for you  

**how to use z-glsl:**

- write `.z.glsl` files with imports like `#import path/to/file.glsl`
  - you can use `@import path/to/file.glsl` instead if you like
  - the paths are relative from the file that has the import statement
  - you can have a semicolon at the end of the import line
- run `npx z-glsl source dist`, this will compile your z-glsl files
  - replace `source` with the directory that has your source files
  - replace `dist` with the build directory that glsl files will be saved to
- add `--watch` to start a watch routine
- add `--verbose` to see more information
