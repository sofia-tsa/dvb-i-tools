/* jshint esversion: 8 */

const fs=require("fs"), path=require("path");

// SLEPR == Service List Entry Point Registry
module.exports.MASTER_SLEPR_FILE = path.join('registries','slepr-master.xml');
module.exports.MASTER_SLEPR_URL = "https://raw.githubusercontent.com/paulhiggs/dvb-i-tools/csr/master/slepr-master.xml";