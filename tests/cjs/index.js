"use strict";


//const util   = require("node:util");
const { CB } = require("./../../lib");
const fns    = require("./../../dist/tests/common/callback-functions")
const {Test} = require("./../common/lib-test");


Test(CB, 
     fns);