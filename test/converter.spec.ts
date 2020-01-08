import { convert } from "..";
import { expect } from "chai";
import * as path from 'path';
import { lstatSync, readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import "mocha";

const DIR = path.join(__dirname, 'check_types');

describe("converter", () => {
  tests().forEach(test => {
    it(`handles ${test.replace(/_/g, " ")}`, () => {
      const testDir = join(DIR, test);
      const actual = convert(join(testDir, "input.proto"));
      const expected = readFileSync(join(testDir, "output.graphql"), "UTF-8");
      expect(normalize(actual)).equal(normalize(expected));
    });
  });
  describe('#options',  () => {
    it('--protos', () => {
      const actual = convert(join(__dirname, 'options/protos/input.proto'), [ 'test/options/protos/protos' ]);
      const expected = readFileSync(join(__dirname, 'options/protos/output.graphql'), "UTF-8");
      expect(normalize(actual)).equal(normalize(expected));
    });
  })
});

function tests() {
  return readdirSync(DIR)
    .filter(dirent => lstatSync(join(DIR, dirent)).isDirectory())
    .filter(subdir => existsSync(join(DIR, subdir, "input.proto")));
}

function normalize(schema: string) {
  return schema
    .replace(/\n+/gm, "\n")
    .replace(/^[ ]+/gm, "  ")
    .replace(/[\n ]+$/gm, "")
    .replace(/[ ]+\n/gm, "");
}
