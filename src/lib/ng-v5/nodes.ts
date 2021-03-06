import * as ts from 'typescript';
import { ParsedConfiguration } from '@angular/compiler-cli';
import { Node } from '../brocc/node';
import { by, isInProgress, isDirty } from '../brocc/select';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
import { DestinationFiles } from '../ng-package-format/shared';
import { FileCache } from '../file/file-cache';

export const TYPE_NG_PACKAGE = 'application/ng-package';
export const TYPE_NG_ENTRY_POINT = 'application/ng-entry-point';

/** A node that can be read through the `fs` api. */
export const URL_PROTOCOL_FILE = 'file://';

/** A node specific to angular. */
export const URL_PROTOCOL_NG = 'ng://';

export function isEntryPoint(node: Node): node is EntryPointNode {
  return node.type === TYPE_NG_ENTRY_POINT;
}

export function isPackage(node: Node): node is PackageNode {
  return node.type === TYPE_NG_PACKAGE;
}

export function byEntryPoint() {
  return by(isEntryPoint);
}

export function isEntryPointInProgress() {
  return by(isEntryPoint).and(isInProgress);
}

export function isEntryPointDirty() {
  return by(isEntryPoint).and(isDirty);
}

export function isFileUrl(value: string): boolean {
  return value.startsWith(URL_PROTOCOL_FILE);
}

export function fileUrl(path: string): string {
  return `${URL_PROTOCOL_FILE}${path}`;
}

export function fileUrlPath(url: string): string {
  if (url.startsWith(URL_PROTOCOL_FILE)) {
    return url.substring(URL_PROTOCOL_FILE.length);
  }
}

export function ngUrl(path: string): string {
  return `${URL_PROTOCOL_NG}${path}`;
}

export class EntryPointNode extends Node {
  readonly type = TYPE_NG_ENTRY_POINT;

  constructor(public readonly url: string, readonly sourcesFileCache?: FileCache) {
    super(url);

    if (sourcesFileCache) {
      this.cache.sourcesFileCache = sourcesFileCache;
    }
  }

  cache = {
    sourcesFileCache: new FileCache(),
    moduleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s),
    analysisModuleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s)
  };

  data: {
    destinationFiles: DestinationFiles;
    entryPoint: NgEntryPoint;
    tsConfig?: ParsedConfiguration;
  };
}

export class PackageNode extends Node {
  readonly type = TYPE_NG_PACKAGE;
  data: NgPackage;

  cache = {
    sourcesFileCache: new FileCache()
  };
}
