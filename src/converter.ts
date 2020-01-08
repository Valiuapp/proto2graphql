import { Root } from "protobufjs";
import * as path from "path";
import { visit } from "./visitor";
import { printType, isCompositeType } from "graphql";
import { existsSync } from 'fs';
export function convert(filename: string, inputPaths: Array<string> = []) {
  const root = new Root();
  const protosDir = path.join(__dirname, "..", "protos");

  const protoPaths = inputPaths
    .map(pathProto => path.isAbsolute(pathProto) ? pathProto : path.join(process.cwd(), ".", pathProto));

  const defaultResolver = root.resolvePath;

  // Provide resolver for protobuf's well-known types
  root.resolvePath = function(origin, target) {

    if (target.startsWith("google/protobuf/")) {
      return path.join(protosDir, target);
    }

    const protoFilePath = protoPaths
      .map( dir => path.resolve(path.join(dir, target)) )
      .find(file => existsSync(file));

    if (protoFilePath) return protoFilePath;

    return defaultResolver(origin, target);
  };

  root.loadSync(filename);
  const types = visit(root.nestedArray);
  return types.map(type => printType(type)).join("\n");
}
