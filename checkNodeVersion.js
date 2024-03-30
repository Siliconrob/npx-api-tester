const result = process.versions;
const allowedNodeMin = 20;

if (result && result.node) {
  if (parseInt(result.node) >= allowedNodeMin) {
    console.log("\x1b[47m\x1b[32m%s\x1b[0m", `-------******* Node Version: ${result.node} *******-------`);
  } else {
console.log("\x1b[47m\x1b[31m%s\x1b[0m", `-------******* Node command failed {npm install, npm start, npm test} failed due to Node Version, Please install and use Node Version >= ${allowedNodeMin} *******-------`);
    console.log("\x1b[47m\x1b[33m%s\x1b[0m", `-------******* Your current Node Version is: ${result.node} *******-------`);
    process.exit(1);
  }
} else {
console.log("\x1b[47m\x1b[31m%s\x1b[0m", "-------******* Something went wrong while checking Node version *******-------");
  process.exit(1);
}