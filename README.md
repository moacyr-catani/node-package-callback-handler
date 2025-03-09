# Callback handler

An utility to deal with **callback functions** and avoid **callback "hell"**.

You can run several functions in **parallel** or in **sequence** (even **mixing both types**) and receive a single result object with results for every call.

In sequential statements, you can access results from immediately previous function, creating cascading calls (**waterfall**).

You can get the result in a **Promise** (using async/await) or providing a **single callback function** that receives the `Result` object with results for every call.

<br/>

## Example

Creating a log file from the content of several files using `node:fs` (callbacks). The order in which every file is appended to log is not importante, so we can parallelize it.

The code will:
- delete current log file (if exists) with `fs.rm()`
- execute (in parallel) for every file
  - read content with `fs.readFile()`, then (sequentially)
  - write content retrieved from previous function to log file with `fs.appendFile()`

All code excerpts will be provided in typescript. To use it in plain javascript, just ignore all types declaration (the **`: type`** part of the code).

```ts
/**
 * Creates a log file from several files
 */

import { CB } from "callback-handler";


const logFile: string = path.resolve(__dirname, "mainLog.log"),
      file1:   string = path.resolve(__dirname, "file1.log"),
      file2:   string = path.resolve(__dirname, "file2.log"),
      file3:   string = path.resolve(__dirname, "file3.log"),
      file4:   string = path.resolve(__dirname, "file4.log"),
      file5:   string = path.resolve(__dirname, "file5.log"),
      file6:   string = path.resolve(__dirname, "file6.log");


// Create sequential execution structure using CB.s()
const structCB = CB.s (
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
                         ),
                         CB.s (
                             CB.f ( fs.readFile, file5, {encoding: 'utf-8'} ),
                             CB.f ( fs.appendFile, logFile, CB.PREVIOUS_RESULT1)
                         ),
                         CB.s (
                             CB.f ( fs.readFile, file6, {encoding: 'utf-8'} ),
                             CB.f ( fs.appendFile, logFile, CB.PREVIOUS_RESULT1)
                        )
                    )
                 );

// Execute and retrieve results
const objResult = await CB.e (structCB);


// Check results
if (objResult.timeout || objResult.error)
{
    console.log("Something went wrong while creating the log");
    return;
}
```

You can run functions in parallel or in sequence, even mixing both ways at the same struct call.  

To insert a call in the struct, use function `CB.f`, which has two overloaded signatures:

```typescript
// Without alias
CB.f ( Fn:      Function, 
       ...Args: any[]);


// With alias
CB.f ( Alias:   string, 
       Fn:      Function, 
       ...Args: any[]);
```

| Param   | Description |
|---------|-------------|
| Alias   | String to uniquely identify a call in result object. |
| Fn      | Function that uses callback to return data (don't write de parenthesis) |
| ...Args | Arguments for the provided function (don't include the callback param)  |

<br/>

Example using function `fs.writeFile` to write some text in UTF-8 enconding to a file: 

```typescript
// Mind:
// - don't include parenthesis after function name
// - don't include the callback parameter
CB.f (fs.writeFile, PathToFile, TextToWrite, "utf-8")
```

Alias: is a string to uniquely identify a call in result object.

Fn: is a function that uses callback to return data.

...Args: are zero or more arguments that you need to pass to Fn in order to get it called with a valid signature (except for the callback function, which will be provided dinamically).

<br>
<br>



## The execution structure
The execution structure stores information about what functions to run (including arguments) and when (execution order).

It is composed of three different structures:




### Function structure (`FunctionStruct`)

Stores info about what function to execute and the arguments to be used, except for the callback (which is always the last argument).

Is is created through `CB.p()` function, which has two overload signatures:

```ts
// Without alias
CB.f ( fn: Function,   // 🠄 function to be executed
       ...args: any[]) // 🠄 arguments to be passed to function
```
```ts
// With alias
CB.f ( alias: string,  // 🠄 alias for this call, to facilitate results retrieval
       fn: Function,   // 🠄 function to be executed
       ...args: any[]) // 🠄 arguments to be passed to function
```

Example using function `fs.writeFile` to write some text in UTF-8 enconding to a file: 

```typescript
// Mind:
// - don't include parenthesis after function name
// - don't include the callback parameter
CB.f (fs.writeFile, PathToFile, TextToWrite, "utf-8")
```


### Parallel structure

Stores info about sub structures to be executed in parallel. Every sub structure can be a **Function Structure** (`FunctionStruct`), a **Sequential Structure** or even another **Parallel Structure**..

Is is created through `CB.p()` function, which has two overload signatures:

```ts
CB.p ( ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct)
```
```ts
CB.p ( alias: string,
      ...subStructs: FunctionStruct | ParallelStruct | SequentialStruct)
```


## Executing functions

### Parallel 

### Sequential

## Getting results

## Checking errors

## Exceptions





// Writes text to console waiting up to half of a second
const fnTest = (p_Value:    string, 
                p_Callback: Function) =>
{
    setTimeout( 
        () =>
        {
            console.log(p_Value);
            p_Callback(null, p_Value + " returned from callback");
        }, 
        Math.random() * 500 // <- Up to 1/2 second before function returns
    );
}

// Creates calls struct
const calls: ParallelStruct = CB.p(
                                  "Parallel calls 1" ,
                                  CB.f (fnTest, "P1"),
                                  CB.f (fnTest, "P2"),
                                  CB.f (fnTest, "P3"),
                                  CB.s ( 
                                      "Sequential call 1",
                                      CB.f (fnTest, "S1"),
                                      CB.f (fnTest, "S2"),
                                      CB.f (fnTest, "S3"),
                                      CB.p ( 
                                          "Parallel calls in a sequence call",
                                          CB.f (fnTest, "S4 P1"),
                                          CB.f (fnTest, "S4 P2"),
                                          CB.f (fnTest, "S4 P3")
                                      )
                                  ),
                                  CB.s ( 
                                      "Sequential call 2",
                                      CB.f ("alias", fnTest, "S5"),
                                      CB.f (fnTest, "S6"),
                                      CB.f (fnTest, "S7")
                                  )
                              );

// Execute calls struct
const results: await Result = CB.r (calls) // Runs the calls structure


A **timeout** limit is used to avoid never returning calls.