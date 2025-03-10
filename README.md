# Callback handler

An utility to deal with **callback functions** and avoid **callback "hell"**.

You can run several functions in **parallel** or in **sequence** (even **mixing both types**) and receive a single result object with results for every call.

In sequential statements, you can access results from immediately previous function, creating cascading calls (**waterfall**).

You can get the result in a **Promise** (using async/await) or providing a **single callback function** that receives the `Result` object with results for every call.
<br/>
<br />

## Example

Creating a log file from the content of several files using `node:fs` (callbacks). The order in which every file is appended to log is not important, so we can parallelize it.

The code will:
- delete current log file (if exists) with `fs.rm()`
- execute (in parallel) for every file
  - read content with `fs.readFile()`, then (sequentially)
  - write content retrieved from previous function to log file with `fs.appendFile()`

> [!NOTE]
> All code excerpts will be provided in typescript. To use it in plain javascript, just ignore all types declaration (the **`: type`** part of the code).

```ts
/**
 * Creates a log file from several files
 */

import { CB } from "callback-handler";


const logFile: string = path.resolve(__dirname, "mainLog.log"),
      file1:   string = path.resolve(__dirname, "file1.log"),
      file2:   string = path.resolve(__dirname, "file2.log"),
      file3:   string = path.resolve(__dirname, "file3.log"),
      file4:   string = path.resolve(__dirname, "file4.log");


// Create execution structure 
const structCB = 
    CB.s ( // 🠄 sequential structure as root

        // Delete current log file
        CB.f ( fs.rm, logFile, {force: true}), // 🠄 Creates a function structure using CB.f()


        // Create log from several files
        CB.p ( // 🠄 parallel structure, since the order in which every file is written in
               //    log is not important (can be parallelized)

            CB.s ( // 🠄 sequential structure
                CB.f ( fs.readFile, file1, {encoding: 'utf-8'} ),      // 🠄 read content 
                CB.f ( fs.appendFile, strLogFile, CB.PREVIOUS_RESULT1) // 🠄 write results from 
                                                                       //    previous call to log file
            ),

            // The same (in parallel) for every file ...
            CB.s (
                CB.f ( fs.readFile, file2, {encoding: 'utf-8'} ),
                CB.f ( fs.appendFile, logFile, CB.PREVIOUS_RESULT1)
            ),
            CB.s (
                CB.f ( fs.readFile, file3, {encoding: 'utf-8'} ),
                CB.f ( fs.appendFile, logFile, CB.PREVIOUS_RESULT1)
            ),
            CB.s (
                CB.f ( fs.readFile, file4, {encoding: 'utf-8'} ),
                CB.f ( fs.appendFile, logFile, CB.PREVIOUS_RESULT1)
            )
        )
    );


// Execute and retrieve results using Promise (async/await)
const objResult = await CB.e (structCB);


// Check results
if (objResult.timeout || objResult.error)
    console.log("Something went wrong while creating the log");
else
    console.log("Log created");
```




## Installation and usage
To install, run this command in your terminal:

`npm install @mcatani/callback-handler`

Load it in your code as ECMAScript (esm) or CommonJS (cjs) module.
```ts
// esm
import { CB } from "@mcatani/callback-handler";
```
```ts
// cjs
const { CB } = require("@mcatani/callback-handler");
```
It can be used in JavaScript or TypeScript codes (no need for additional types).





## The execution structure
The execution structure stores information about what functions to run (including arguments) and when (execution order).

It is composed of three different structures:





### Function structure (`FunctionStruct`)

Stores info about what function to execute and the arguments to be used, except for the callback (which is always the last argument).

It is created through `CB.p()` function, which has two overloaded signatures:

```ts
// Without alias
CB.f ( fn: Function,    // 🠄 function to be executed
       ...args: any[]); // 🠄 arguments to be passed to function
```
```ts
// With alias
CB.f ( alias: string,   // 🠄 alias for this call, to facilitate results retrieval
       fn: Function,    // 🠄 function to be executed
       ...args: any[]); // 🠄 arguments to be passed to function
```

Example using `fs.writeFile()` to write some text in UTF-8 enconding to a file: 

```typescript
// Mind:
// - don't include parenthesis after function name
// - don't include the callback parameter
CB.f (fs.writeFile, PathToFile, TextToWrite, "utf-8")
```



### Parallel structure (`ParallelStruct`)

Stores info about sub structures to be executed in parallel. Every sub structure can be:
- a **Function Structure** (`FunctionStruct`), 
- a **Sequential Structure** (`SequentialStruct`),
- or even another **Parallel Structure** (`ParallelStruct`).

It is created through `CB.p()` function, which has two overloaded signatures:

```ts
// Without alias
CB.p ( ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct);
```
```ts
// With alias
CB.p ( alias: string,
      ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct);
```

Example using `fs.writeFile()` to write text in UTF-8 enconding to 3 files in parallel: 

```typescript
CB. p (
    CB.f (fs.writeFile, PathToFile1, TextToWrite1, "utf-8"),
    CB.f (fs.writeFile, PathToFile2, TextToWrite2, "utf-8"),
    CB.f (fs.writeFile, PathToFile3, TextToWrite3, "utf-8")
);
```



### Sequential structure

Stores info about sub structures to be executed in sequence (execution only starts after the previous one finishes). Every sub structure can be:
- a **Function Structure** (`FunctionStruct`), 
- a **Parallel Structure** (`ParallelStruct`),
- or even another **Sequential Structure** (`SequentialStruct`).

It is created through `CB.s()` function, which has two overloaded signatures:

```ts
// Without alias
CB.p ( ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct)
```
```ts
// With alias
CB.p ( alias: string,
      ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct)
```
Results from the immediately previous call can be used as arguments in a **Function Structure**

Example using `fs.readFile()` and `fs.appendFile()` to read text from a file and then append it to another file: 

```typescript
CB.s (
    CB.f ( fs.readFile, PathToFileFrom, {encoding: 'utf-8'} ),
    CB.f ( fs.appendFile, PathToFileTo, CB.PREVIOUS_RESULT1)
)
```

#### Accessing previous results

To use previous results in a function, use one of the following tokens as arguments to your function:

| Token | Description |
| ----------- | ----------- |
| `CB.PREVIOUS_ERROR`   | Value of the first argument (which is the error one), passed to callback function |
| `CB.PREVIOUS_RESULT1` | Value of the first argument after the error (i.e. the second argument) passed to callback function |
| `CB.PREVIOUS_RESULT2` | Value of the second argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT3` | Value of the third argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT4` | Value of the fourth argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT5` | Value of the fifth argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT6` | Value of the sixth argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT7` | Value of the seventh argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT8` | Value of the eighth argument after the error passed to callback function |
| `CB.PREVIOUS_RESULT9` | Value of the ninth argument after the error passed to callback function |

If you try to use a token in the very first function of a sequential structure, an exception will be thrown, since there is no previous result.





### Anatomy of execution structure

Execution structure is a tree where:
- all leaves are **Function Structures**,
- all nodes are **Parallel Structures** or **Sequential Structures**,
- root is a **Parallel Structure** or **Sequential Structure**.




## Executing functions

Use the function `CB.e()` to execute a previously created execution structure and get the results.

You can do that using **async/await** (Promise) or providing a **callback function**.




#### Callback function

To use the callback approach, provide a function as last argument to execution function
```ts
CB.e (structure, callbackFunction);
```

The callback function must have the signature:
```ts
function(error:   boolean, // 🠄 true if an error was returned for any function structure execution
                           //    or if any exception was thrown
         timeout: boolean, // 🠄 true if ellapsed execution time exceeds defined timeout
         result:  Result); // 🠄 Result object
```
<br/>

#### Async/await

To use async/await approach, just ignore the callback argument of execution function 
```ts
const result = await CB.e (structure);
```
<br/>
<br/>


#### Anatomy of execution function (`CB.e()`)
The execution function has several overloads
```ts
    function e(p_CallStruct:    ExecStruct): Promise<Result>;
    function e(p_CallStruct:    ExecStruct, 
               p_Timeout:       number): Promise<Result>;
    function e(p_CallStruct:    ExecStruct, 
               p_Timeout:       number,
               p_BreakOnError:  boolean): Promise<Result>;
    function e(p_CallStruct:    ExecStruct, 
               p_Timeout:       number,
               p_BreakOnError:  boolean,
               p_Stats:         boolean): Promise<Result>;
``` 

## Getting results

## Checking errors

## Exceptions
All exceptions and errors will be instances of `CBException` class, which has the properties:

| Property | Description |
| ----------- | ----------- |
| details   | This will be set when the exception comes from a function execution or when a function execution returns an error in callback. It will have a `callIndex` value and may have a `callAlias` value (if provided).|
| explanation | A brief text with clues as to what might have gone wrong |

<br/>
<br/>


## Feedback
If you have any comment, sugestion or if you find any problem using `callback-handler`, create, please, an [issue](https://github.com/moacyr-catani/node-package-callback-handler/issues) in GitHub projec's page.

I do appreciate any feedback and will do my best to answer quickly.