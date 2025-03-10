import fs   from "node:fs";
import path from "node:path";
import { CB } from "./../../src/index.js"


         
type FileStruct = 
{
    file: string
}



export const WriteLog: Function = async function()
{
    const strBasePath: string = path.resolve(__dirname, "./_files");
    const dtmNow:      Date   = new Date(Date.now());
    const strLogFile:  string = path.resolve(strBasePath, dtmNow.toISOString().substring(0, 10) + ".log");
    const arrFiles:    Array<FileStruct> =
    [
        {file: path.resolve(strBasePath, "file1")},
        {file: path.resolve(strBasePath, "file2")},
        {file: path.resolve(strBasePath, "file3")},
        {file: path.resolve(strBasePath, "file4")},
        {file: path.resolve(strBasePath, "file5")},
        {file: path.resolve(strBasePath, "file6")}
    ];


    // Create execution structure
    const structCB = CB.s ( // 🠄 creates a sequential structure as root

                        // Delete current log file
                        CB.f ( fs.rm, strLogFile, {force: true}),

                        // Create log from several files
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[0].file, {encoding: 'utf-8'} ), // 🠄 read content from file
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)       // 🠄 write results from previous call in log file
                        ),
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[1].file, {encoding: 'utf-8'} ),
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)
                        ),
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[2].file, {encoding: 'utf-8'} ),
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)
                        ),
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[3].file, {encoding: 'utf-8'} ),
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)
                        ),
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[4].file, {encoding: 'utf-8'} ),
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)
                        ),
                        CB.s (
                            CB.f ( fs.readFile, arrFiles[5].file, {encoding: 'utf-8'} ),
                            CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1)
                        ),
                     );

    const objResult = await CB.e (structCB);


    // Check results
    if (objResult.timeout || objResult.error)
    {
        console.log("Something went wrong while deleting current files and writing them again");
        return;
    }


    console.log("\nLog file created");
    console.log("\nCheck file: ", strLogFile);
}