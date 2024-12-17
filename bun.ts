import { dlopen, FFIType, suffix } from "bun:ffi";

const {
  symbols: {
    sqlite3_libversion, // the function to call
  },
} = dlopen(
  "./AquesTalk/f1/AquesTalk.dll",
  {
    sqlite3_libversion: {
      // no arguments, returns a string
      args: [],
      returns: FFIType.cstring,
    },
  },
);

console.log(`SQLite 3 version: ${sqlite3_libversion()}`);