import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import "dotenv/config";

export default {
  input: "src/index.ts",
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
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: false
    }),
    replace({
      preventAssignment: true,
      'process.env.VITE_IO_INTELLIGENCE_LICENSE_KEY': JSON.stringify(process.env.VITE_IO_INTELLIGENCE_LICENSE_KEY)
    })
  ],
  external: [],
};
