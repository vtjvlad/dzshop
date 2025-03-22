module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    resources: "usable",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
};
