// To compile:
// 1. npm install
// 2. bun build main.ts --compile --outfile argdown

import {
	ArgdownApplication,
	ArgumentSelectionPlugin,
	ColorPlugin,
	DataPlugin,
	DotExportPlugin,
	ExplodeArgumentsPlugin,
	GroupPlugin,
	IArgdownRequest,
	MapPlugin,
	ModelPlugin,
	ParserPlugin,
	PreselectionPlugin,
	RegroupPlugin,
	StatementSelectionPlugin,
} from "@argdown/core";
import { SyncDotToSvgExportPlugin } from "@argdown/core/dist/plugins/SyncDotToSvgExportPlugin.js";
import { readFileSync } from 'fs'

const argdown = new ArgdownApplication();
argdown.addPlugin(new ParserPlugin(), "parse-input");
argdown.addPlugin(new DataPlugin(), "build-model");
argdown.addPlugin(new ModelPlugin(), "build-model");
argdown.addPlugin(new ExplodeArgumentsPlugin(), "build-model");
argdown.addPlugin(new RegroupPlugin(), "build-model");
argdown.addPlugin(new PreselectionPlugin(), "build-map");
argdown.addPlugin(new StatementSelectionPlugin(), "build-map");
argdown.addPlugin(new ArgumentSelectionPlugin(), "build-map");
argdown.addPlugin(new MapPlugin(), "build-map");
argdown.addPlugin(new GroupPlugin(), "build-map");
argdown.addPlugin(new ColorPlugin(), "colorize");
argdown.addPlugin(new DotExportPlugin(), "export-dot");
argdown.addPlugin(new SyncDotToSvgExportPlugin(), "export-svg");

type Args = {
	format?: string;
	size?: string;
	ratio?: string;
	verbose?: boolean;
	logParserErrors?: boolean;
};

const args: Args = { logParserErrors: true };

const request: IArgdownRequest = {};

request.dot = {};
request.dot.graphVizSettings = {};
if (args.size) {
	request.dot.graphVizSettings.size = args.size;
}
if (args.ratio) {
	request.dot.graphVizSettings.ratio = args.ratio;
}

request.process = ["parse-input"];
request.process.push("build-model");
request.process.push("build-map");
request.process.push("colorize");
request.process.push("export-dot");
request.process.push("export-svg");

try {
  const input = readFileSync(0, 'utf8');
  request.input = input;

  const responses = argdown.run(request);
  if (responses.exceptions && responses.exceptions.length > 0) {
    for (const exception of responses.exceptions) {
      throw exception;
    }
  }
  if (
    (responses.lexerErrors && responses.lexerErrors.length > 0) ||
    responses.parserErrors && responses.parserErrors.length > 0
  ) {
    throw new Error("Parsing error occurred.")
  }
  console.log(responses.svg);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

