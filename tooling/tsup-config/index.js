const { defineConfig } = require('tsup')

module.exports = defineConfig((options) => ({
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  outDir: "lib",
  external: [
    "react",
    "react-dom",
    "@chakra-ui/react",
    "@chakra-ui/icons",
    "react-router-dom",
    "graphql",
    "react-icons",
    "framer-motion",
    "@apollo/client",
  ],
  ...options,
}))
