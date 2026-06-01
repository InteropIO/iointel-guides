import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "dist/index.cjs",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: false,
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json()
  ],
  external: [],
};
