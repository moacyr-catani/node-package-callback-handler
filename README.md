# Callback utility

An utility handler to deal with **callback functions** and avoid **callback "hell"**.

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

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #0969da;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #0969da;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>
    Note
  </p>
  <p dir="auto">Code excerpts will be provided in TypeScript. To use it in plain JavaScript, just ignore all types declaration (the <strong><code>: type</code></strong> part of the code).
  </p>
</div>

```ts
/**
 * Creates a log file from several files
 */

import { CB, 
         Result } from "callback-utility";
import path       from "node:path";
import fs         from "node:fs";


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
const objResult: Result = await CB.e (structCB);


// Check results
if (objResult.timeout || objResult.error)
    console.log("Something went wrong while creating the log");
else
    console.log("Log created");
```

<br/>
<br />



## Installation and usage
To install, run this command in your terminal:

`npm install callback-utility`

<br/>

Load it in your code as ECMAScript (esm) or CommonJS (cjs) module.
```ts
// esm
import { CB } from "callback-utility";
```
```ts
// cjs
const { CB } = require("callback-utility");
```
<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #1a7f37;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #1a7f37;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
    Tip
  </p>
  <p dir="auto">
    It can be used in JavaScript or TypeScript codes (no need for additional types).
  </p>
</div>

<br/>
<br />



## The execution structure
The execution structure stores information about what functions to run (including arguments) and when (execution order).

It is composed of three different structures:

<br/>



### Function structure (`FunctionStruct`)

Stores info about what function to execute and the arguments to be used, except for the callback (which is always the last one).

It is created through `CB.f()` function, which has two overloaded signatures:

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

<br/>




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

<br />



### Sequential structure (`SequentialStruct`)

Stores info about sub structures to be executed in sequence (execution only starts after the previous one finishes). Every sub structure can be:
- a **Function Structure** (`FunctionStruct`), 
- a **Parallel Structure** (`ParallelStruct`),
- or even another **Sequential Structure** (`SequentialStruct`).

It is created through `CB.s()` function, which has two overloaded signatures:

```ts
// Without alias
CB.s ( ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct)
```
```ts
// With alias
CB.s ( alias: string,
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

<br/>



#### Accessing previous results

To use previous results, pass one of the following tokens as arguments to your function:

| Token | Description |
| ----------- | ----------- |
| `CB.PREVIOUS_ERROR`   | Value of the first argument (**which is the error**) passed to callback function |
| `CB.PREVIOUS_RESULT1` | Value of the *first argument* **after the error** (i.e. the second argument) passed to callback function |
| `CB.PREVIOUS_RESULT2` | Value of the *second argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT3` | Value of the *third argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT4` | Value of the *fourth argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT5` | Value of the *fifth argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT6` | Value of the *sixth argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT7` | Value of the *seventh argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT8` | Value of the *eighth argument* after the error passed to callback function |
| `CB.PREVIOUS_RESULT9` | Value of the *ninth argument* after the error passed to callback function |

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    If you try to use a token in the very first function of a sequential structure, an exception will be thrown, since there is no previous result.
  </p>
</div>

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    If you try to use a token in a parallel structure, an exception will be thrown.
  </p>
</div>

<br/>



### Anatomy of execution structure

Execution structure is a tree where:
- all leaves are **Function Structures**,
- all nodes are **Parallel Structures** or **Sequential Structures**,
- root is a **Parallel Structure** or **Sequential Structure**.

An example:

```ts
Parallel            🠄 root
┣━ Function         🠄 leaf
┣━ Sequential       🠄 node
┃  ┣━ Function      🠄 leaf
┃  ┣━ Function      🠄 leaf
┃  ┗━ Parallel      🠄 node
┃     ┣━ Function   🠄 leaf
┃     ┗━ Function   🠄 leaf 
┗━ Paralell         🠄 node
   ┣━ Function      🠄 leaf
   ┗━ Function      🠄 leaf
```

<br/>
<br />



## Executing functions

Use the function `CB.e()` to execute a previously created execution structure and get the results.

You can do that using **async/await** (Promise) or providing a **callback function**.

<br/>



#### Callback function

To use the callback approach, provide a function as last argument to execution function.
```ts
CB.e (execStruct, callback);
```

The callback function must have the signature:
```ts
function (error:   boolean |,   // 🠄 true, if an error was returned from any function,
                   CBException  //    or CBException, if any exception was thrown during execution
          timeout: boolean,     // 🠄 true if ellapsed execution time exceeds defined timeout
          result:  Result);     // 🠄 Result object
```

<br/>



#### Async/await

To use async/await approach, just ignore the callback argument of execution function 
```ts
const result: Result = await CB.e (execStruct);
```

<br/>



#### Anatomy of execution function (`CB.e()`)
The execution function has several overloads
```ts
    // For async/await approach
    function e (execStruct:    ParallelStruct | SequentialStruct): Promise<Result>;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number): Promise<Result>;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number,
                breakOnError:  boolean): Promise<Result>;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number,
                breakOnError:  boolean,
                stats:         boolean): Promise<Result>;


    // For callback approach
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                callback:      TCallback): void;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number,
                callback:      TCallback): void;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number,
                breakOnError:  boolean,
                callback:      TCallback): void;
    function e (execStruct:    ParallelStruct | SequentialStruct, 
                timeout:       number,
                breakOnError:  boolean,
                stats:         boolean,
                callback:      TCallback): void
``` 

| Argument       | Description                                                                            | Default value |
| ----------     | -----------                                                                            | ------|
| `execStruct`   | Execution structure (`ParallelStruct` or `SequentialStruct`) to be executed            |       |
| `timeout`      | Maximum time (in milliseconds) for the execution to complete                           | 5000  |
| `breakOnError` | Defines if execution must be stopped at first error returned from a function structure | true  |
| `stats`        | Defines if the execution time ellapsed must be gathered                                | false |
| `callback`     | Callback function to retrieve results (only for callback approach)                     |       |

Examples:
```ts
// Using await/async
const result: Result = await CB.e (executionStructure); // 🠄 Execute with default values:
                                                        //        timeout      = 5000
                                                        //        breakOnError = true
                                                        //        stats        = false

const result: Result = await CB.e (executionStructure,  // 🠄 Execution structure:
                                   2000,                // 🠄 2 seconds for timeout
                                   false,               // 🠄 Don't stop execution if error is returned
                                   true);               // 🠄 Gather stats info
```

```ts
// Using callback
CB.e (executionStructure,           // 🠄 Execution structure
      (error, timeout, result) =>   // 🠄 Callback function
      {
          if (error || timeout)
              console.log("Something wrong");
          else
              // do stuff ...

      });

CB.e (executionStructure,           // 🠄 Execution structure
      3500,                         // 🠄 3.5 seconds for timeout
      true,                         // 🠄 Stop execution if any error is returned
      true,                         // 🠄 Gather stats info
      (error, timeout, result) =>   // 🠄 Callback function
      {
          if (error || timeout)
              console.log("Something wrong");
          else
              // do stuff ...

      });

```

<br/>
<br />



## Getting results

### Getting results by position

```ts
/**
 * Reading content from several files in parallel
 */

const struct = CB.p ( 
                   CB.f (fs.readFile, PathToFile1, {encoding: 'utf-8'}), // 🠄 position: 1
                   CB.f (fs.readFile, PathToFile2, {encoding: 'utf-8'}), // 🠄 position: 2
                   CB.f (fs.readFile, PathToFile3, {encoding: 'utf-8'}), // 🠄 position: 3
                   CB.f (fs.readFile, PathToFile4, {encoding: 'utf-8'})  // 🠄 position: 4
               );

const result = await CB.e (struct);


if (result.error || result.timeout)
{
    console.log("Something wrong");
}
else
{
    //                          ⮦ result position
    const file1Content = result[1].results[0];
    const file2Content = result[2].results[0];
    const file3Content = result[3].results[0];
    const file4Content = result[4].results[0];
    //                                     ⮤ first result for every function, i.e., the first 
    //                                       argument passed to callback
}
```

<br />


### Getting results by alias

```ts
/**
 * Reading content from several files in parallel
 */

const struct = CB.p ( 
                   //       ⮦ aliases
                   CB.f ("file1", fs.readFile, PathToFile1, {encoding: 'utf-8'}),
                   CB.f ("file2", fs.readFile, PathToFile2, {encoding: 'utf-8'}),
                   CB.f ("file3", fs.readFile, PathToFile3, {encoding: 'utf-8'}),
                   CB.f ("file4", fs.readFile, PathToFile4, {encoding: 'utf-8'})
               );

const result = await CB.e (struct);


if (result.error || result.timeout)
{
    console.log("Something wrong");
}
else
{
    //                                        ⮦ aliases
    const file1Content = result.getByAlias("file1").results[0];
    const file2Content = result.getByAlias("file2").results[0];
    const file3Content = result.getByAlias("file3").results[0];
    const file4Content = result.getByAlias("file4").results[0];
}
```
<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    Aliases are case-sensitive
  </p>
</div>

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    If you use the same alias more than once, an exception will be thrown
  </p>
</div>

<br/>
<br />



## Anatomy of Results

### Result object (`Result`)

Results for every **Execution structure** are stored in an instance of the `Result` class, which is an array-like object, i.e.:
- it has a `lenght` property,
- it can be iterated using a `for` statement,
- results can be retrieved by position

Results are stored in the same position as they were coded:
- Results for `FunctionStruct` are stored in a `FunctionResult` object
- Results for `ParallelStruct` are stored in a `ParallelResult` object
- Results for `SequentialStruct` are stored in a `SequentialResult` object

Example:
```ts
Parallel            🠄 result[0]  : ParallelResult
┣━ Function         🠄 result[1]  : FunctionResult
┣━ Sequential       🠄 result[2]  : SequentialResult
┃  ┣━ Function      🠄 result[3]  : FunctionResult 
┃  ┣━ Function      🠄 result[4]           ⇣
┃  ┗━ Parallel      🠄 result[5]
┃     ┣━ Function   🠄 result[6]
┃     ┗━ Function   🠄 result[7]
┗━ Paralell         🠄 result[8]
   ┣━ Function      🠄 result[9]
   ┗━ Function      🠄 result[10]
```
<br />


#### Properties

**`error`**  
Boolean indicating if any error was returned by a function or if any exception was thrown during execution.  

**`length`**  
The number of results stored (structures executed). It is the same as the quantity of `CB.f()`, `CB.p()` or `CB.s()` used to create the execution structure.

**`stats`**  
Milliseconds ellapsed during execution.

> <p><span style="font-size: 1.5rem ; padding: 0.5rem 0 0.3rem 0; color: #9a6700; display: flex; font-weight: 500; line-height: 1; align-items: center">⚠</span> <span style="font-size: 1.2rem ; padding: 0.5rem 0 0.3rem 0; color: #9a6700; display: flex; font-weight: 500; line-height: 1; align-items: center">Warning</span></p>
> Stats will be gathered only if the value of `stats` argument of `CB.e()` was set to true


<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    Stats will be gathered only if the value of <code>stats</code> argument of <code>CB.e()</code> was set to true
  </p>
</div>

<br />


#### Methods

**`getByAlias( alias: string)`**  
Get the result for the provided alias.

**`getErrors()`**  
Get an array with all errors returned from function executions.

Errors returned by functions will be wrapped in a `CBException` object. You can get the function that originated the error by checking the `details` property of the exception, which will inform the position (`callIndex`) and alias (`callAlias`, if provided) for the faulty structure:
```ts
...
const errors: CBException[] = result.getErrors();

for (let error of errors)
{
    console.log(error.details.callIndex); // Position of the function in execution structure and in result object
    console.log(error.details.callAlias); // Execution structure alias, if provided
}
```

<br />



### Function results (`FunctionResult`)

`FunctionResult` stores results from `FunctionStruct` execution. 
<br />


#### Properties

**`error`**  
Stores the **first argument** passed to callback function. By convention, the first argument of a callback function indicates any error that may have occured during execution. 

**`results`**  
Stores, in an **array**, all arguments passed to callback function, **except the first one**.

Example: getting results from `fs.read()`
```ts
// Signature for fs.read() callback is as follows:
function(err:       Error,   // 🠄 will be stored in FunctionResult.error
         bytesRead: number,  // 🠄 will be stored in FunctionResult.results[0]
         buffer     Buffer); // 🠄 will be stored in FunctionResult.results[1]
```

```ts
const struct = CB.s (
                   CB.f (fs.read, fd, buffer, offset, length, position),
                   ...
               );
const result: Result = await CB.e (struct);

if (!result.error && !result.timeout) // 🠄 no error, go on...
{
    const bytesRead: number = result[1].results[0];
    const buffer:    Buffer = result[1].results[1];
}
```

**`stats`**  
Milliseconds ellapsed during execution.

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    Stats will be gathered only if the value of <code>stats</code> argument of <code>CB.e()</code> was set to true
  </p>
</div>

<br />



### Parallel and sequential results (`ParallelResult`, `SequentialResult`)

`ParallelResult` and `SequentialResult` store results for every sub-structure executed. It is an array-like object, i.e.:
- it has a `lenght` property,
- it can be iterated using a `for` statement,
- results can be retrieved by position

It is pretty similiar to `FunctionResult` class, but `error` and `results` properties return arrays with the same hierarchy of the sub structures executed.

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #1a7f37;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #1a7f37;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
    Tip
  </p>
  <p dir="auto">
    Retrieving results through <code>ParallelResult</code> or <code>SequentialResult</code> can be tricky, specially for complex structures (too many nodes). It is preferable to deal with each child <code>FunctionResult</code> instead.
  </p>
</div>

<br />


#### Properties

**`error`**  
Array with all errors returned from sub structures execution. The array will keep the same "hierarchy" of the original execution structure, i.e., there will be array inside arrays for child structures.

**`length`**  
The number of results stored (sub structures executed).

**`results`**  
An **array** with all results from all sub structures executed. The array will keep the same "hierarchy" of the original execution structure, i.e., there will be array inside arrays for child structures.

**`stats`**  
Milliseconds ellapsed during execution.

<div style="padding: 0.5rem 1rem 0.1rem 1rem; margin-bottom: 1rem; color: inherit; border-left: .25em solid #9a6700;" dir="auto">
  <p style="display: flex; font-weight: 500; align-items: center; line-height: 1; color: #9a6700;" dir="auto">
    <svg style="display: inline-block; overflow: visible !important; vertical-align: text-bottom; fill: currentColor; margin-right: 0.5rem !important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    Stats will be gathered only if the value of <code>stats</code> argument of <code>CB.e()</code> was set to true
  </p>
</div>

<br/>

Example:  

For an execution structure like:
```ts
Parallel
┣━ Function
┣━ Sequential        🠄 result[2]
┃  ┣━ Function         🠄 child struct 1
┃  ┣━ Function         🠄 child struct 2
┃  ┗━ Parallel         🠄 child struct 3
┃     ┣━ Function         🠄 grand child struct 1
┃     ┗━ Function         🠄 grand child struct 2
┗━ Paralell
   ┣━ Function
   ┗━ Function
```

The `result[2]` will give us the following results:
```ts
result[2].error = [
                     error,    // 🠄 child 1 error
                     error,    // 🠄 child 2 error
                     [         // 🠄 child 3 error (an array, since it is a parallel struct)
                        error, //    🠄 grand child 1 error
                        error  //    🠄 grand child 2 error
                     ]
                  ];

result[2].results = [
                        result[],    // 🠄 child 1 result (an array)
                        result[],    // 🠄 child 2 result
                        [            // 🠄 child 3 result (an array of arrays, since it is a parallel struct)
                           result[], //    🠄 grand child 1 result
                           result[]  //    🠄 grand child 2 result
                        ]
                     ];

```

<br/>
<br />



## Checking errors
```ts
// Using async/await

// ...
const result: Result = await CB.e (struct);

if (result.error || result.timeout) 
    console.log("Something wrong");
else
    // Do stuff ...
```

```ts
// Using callback

// ...
CB.e (executionStructure,
      (error, timeout, result) =>
      {
          if (error || timeout)
              console.log("Something wrong");
          else
              // do stuff ...

      });
```

<br/>
<br />



## Exceptions
Thrown exceptions and values from `Result.getErrors()` will be instancess of `CBException` class, which extends `Error` and add the properties:

**`baseException`**  
The original emitted exception that is been wrapped in `CBException`

**`errorNumber`**  
A unique number for every type of exception mapped

**`details`**  
This will be set when the exception comes from a function execution or when a function execution returns an error in callback. It will have a `callIndex` value and may have a `callAlias` value (if provided).
- **`details.callIndex`**: number of the indexed position of the function structure in `Result`.
- **`details.callAlias`**: Alias (if provided) for the function structure that emitted the error.

**`explanation`**  
A brief text with clues as to what might have gone wrong

<br/>
<br/>


## Feedback
If you have any comment, sugestion or if you find any problem using `callback-utility`, create, please, an [issue](https://github.com/moacyr-catani/node-package-callback-handler/issues) in GitHub projec's page.

I do appreciate any feedback and will do my best to answer quickly.