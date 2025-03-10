import fs   from "node:fs";
import path from "node:path";
import { CB } from "./../../src/index.js"



type FileStruct = 
{
    file: string,
    content: string
}


export const WriteParallel: Function = async function()
{
    const strBasePath: string = path.resolve(__dirname, "./_files");
    const arrFiles:    Array<FileStruct> =
    [
        {file: path.resolve(strBasePath, "file1"), content: "Content of file 1"},
        {file: path.resolve(strBasePath, "file2"), content: "Content of file 2"},
        {file: path.resolve(strBasePath, "file3"), content: "Content of file 3"},
        {file: path.resolve(strBasePath, "file4"), content: "Content of file 4"},
        {file: path.resolve(strBasePath, "file5"), content: "Content of file 5"},
        {file: path.resolve(strBasePath, "file6"), content: "Content of file 6"},
    ]


    // Delete and rewrite files
    const structCB = CB.p (
                        CB.f (fs.writeFile, arrFiles[0].file, arrFiles[0].content),
                        CB.f (fs.writeFile, arrFiles[1].file, arrFiles[1].content),
                        CB.f (fs.writeFile, arrFiles[2].file, arrFiles[2].content),
                        CB.f (fs.writeFile, arrFiles[3].file, arrFiles[3].content),
                        CB.f (fs.writeFile, arrFiles[4].file, arrFiles[4].content),
                        CB.f (fs.writeFile, arrFiles[5].file, arrFiles[5].content)
                     );

    const objResultDelete = await CB.e (structCB);


    // Check results
    if (objResultDelete.timeout || objResultDelete.error)
    {
        console.log("Something went wrong while deleting current and writing them again");
        return;
    }


    console.log("\nAll files writen");
    console.log("\nCheck folder: ", strBasePath);
}