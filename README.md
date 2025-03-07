# Callback handler


A package to deal with **callback functions** and avoid **callback "hell"**.

You can run several functions in **parallel** or in **sequence**, even **mixing both types**, and receive a single result object with results for every call.

A **timeout** limit is used to avoid never returning calls.

In sequential calls, you can access results from immediately previous call, creating cascading calls (**waterfall**).

You can get the result in a **Promise** (using async/await) or providing a **single callback function** that receives the `Result` object with results for every call (or a timeout).

## How it works

All code excerpts will be provided in typescript. To use it in plain javascript, just ignore all types declaration (the ": type" part of the code).

Below an example of a call struct that runs functions in parallel and in sequence:

```ts
import { CB } from "callback-handler";


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

## Exceptions