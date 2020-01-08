import * as program from "commander";
import { convert } from "./converter";
import { writeFileSync } from "fs";

program
  .version(require("../package.json").version)
  .option("-i, --input [path]", 'path to ".proto" file')
  .option(
    "-o, --output [path]",
    'path to ".graphql" output, otherwise uses STDOUT'
  )
  .option("--protos [paths]", "protos folder separated by ,", '')
  .parse(process.argv);

const protoPaths = program.protos.split(',')

const schema = convert(program.input, protoPaths);

if (program.output) {
  writeFileSync(program.output, schema);
} else {
  console.log(schema);
}
