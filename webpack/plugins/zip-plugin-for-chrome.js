var fs = require("fs");
var archiver = require("archiver");
const bump = require("json-bump");
require("dotenv").config();

class ZipPluginForChrome {
  constructor(options) {
    this.options = options;
    this.checkWorkingEnv(options);
  }

  apply(compiler) {
    compiler.hooks.emit.tap("ZipPluginForChrome", () => {
      let dirFormat = false;
      let dirName = this.options.directory || "src";

      if (this.checkWorkingEnv(this.options)) {
        fs.access(`./${dirName}`, (error) => {
          if (error) {
            console.error("Extension Plugin ERR: directory missing");
          } else {
            dirFormat = true;
            if (dirFormat) {
              if (this.options.version) {
                this.changeVersion(dirName, this.options.version);
              } else {
                console.error("Missing version in options");
              }
              this.createZipFile(dirName, `${this.options.name}` || "prod");
            }
          }
        });
      } else {
        console.warn(
          "No ZIP will be generated as NODE_ENV is not production and buildZipOverride is not set to true",
        );
      }
    });
  }

  checkWorkingEnv(options) {
    return process.env.NODE_ENV === "production" || options.buildZipOverride;
  }

  createZipFile(dirName, outputFileName) {
    let output = fs.createWriteStream(outputFileName);
    let archive = archiver("zip", {});

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log("archiver has been finalized and the output file descriptor has closed.");
    });

    archive.on("error", function (err) {
      throw err;
    });

    archive.pipe(output);

    archive.directory(`${dirName}/`, false);
    console.log(`${outputFileName}.zip file created in root directory`);
    archive.finalize();
  }

  changeVersion(dirName, version) {
    let updateObject = {
      entry: "version",
      replace: version.toString(),
    };
    bump(`${dirName}/manifest.json`, updateObject);
  }
}

module.exports = ZipPluginForChrome;
