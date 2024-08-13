To compile:
1. Install `bun`
2. Clone the repository
3. `cd` to the directory
4. `bun install`
5. `bun build main.ts --compile --outfile argdown`

To compile for different platforms, see https://bun.sh/docs/bundler/executables#cross-compile-to-other-platforms

To use, pipe an argdown file from stdin and receive the svg output from stdout.

A compiled executable is available in releases.
