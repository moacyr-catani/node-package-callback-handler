import { CB, 
         ExecStruct, 
         Result } from "./../src/index.js";
import * as fns   from "../tests/common/callback-functions.js";




const blnMixedStructs  = true,
      blnWithErrors    = false,
      blnMoreThan1CB   = false,
      blnWithException = false,
      blnInvalidParam  = false;


(async ()=>
{
    try
    {
        // Mixed structs
        if (blnMixedStructs)
        {
        
            const arrResults: any[] = [];
        
            const calls   = CB.p( "Parallel calls 1" ,
                                CB.f (fns.fnTestWithTimeout, arrResults, 300, "P1"),
                                CB.f (fns.fnTestWithTimeout, arrResults, 200, "P2"),
                                CB.f (fns.fnTestWithTimeout, arrResults, 100, "P3"),
                                CB.s ( "Sequential call 1",
                                        CB.f (fns.fnTest, arrResults, "S1"),
                                        CB.f (fns.fnTest, arrResults, "S2"),
                                        CB.f (fns.fnTest, arrResults, "S3"),
                                        CB.p ( "Parallel calls in a sequence call",
                                                CB.f (fns.fnTestWithTimeout, arrResults, 300, "S4 P1"),
                                                CB.f (fns.fnTestWithTimeout, arrResults, 200, "S4 P2"),
                                                CB.f (fns.fnTestWithTimeout, arrResults, 100, "S4 P3"),
                                                CB.s ( "Sequential call 1",
                                                       CB.f (fns.fnTest, arrResults, "S1"),
                                                       CB.f (fns.fnTest, arrResults, "S2"),
                                                       CB.f (fns.fnTest, arrResults, "S3")
                                                )
                                        ),
                                        //CB.f ("fn",fnTest, arrResults, "___")
                                        CB.f ("fn",fns.fnTestPrevious1, arrResults, "___", CB.PREVIOUS_RESULT1)
                                ),
                                CB.s ( "Sequential call 2",
                                        CB.f ("alias", 
                                              fns.fnTest, arrResults, "S5"),
                                        CB.f (fns.fnTest, arrResults, "S6"),
                                        CB.f (fns.fnTest, arrResults, "S7")
                                )
                            );
        
        
            const objResult: Result = await CB.e(calls, 200000, false, true)
            console.log(objResult);
            console.log(objResult.getByAlias("alias"));
        }



        // With error
        if (blnWithErrors)
        {
            const arrResults: any[] = [];
        
            const calls   = CB.s( "Parallel calls 1" ,
                                CB.f (fns.fnTestWithTimeout, arrResults, 300, "P1"),
                                CB.f (fns.fnTestWithError, arrResults, "P2"),
                                CB.f (fns.fnTestWithTimeout, arrResults, 500, "P3")
                            );
        
        
            const objResult: Result = await CB.e(calls, 5000, false)
            console.log(objResult);
            console.log(objResult.getByAlias("alias"));

        }


        // More than 1 callback
        if (blnMoreThan1CB)
        {
            const arrExec: string[] = [];

            const calls =   CB.s( "Sequential calls 1" ,
                                CB.f (fns.fnTestTwoCallbacks, arrExec, "S2"),
                                CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1"),
                            );

            const objResult: Result = await CB.e(calls, 5000, false)
            console.log(objResult);
        }


        // Exception in function execution
        if (blnWithException)
        {
            const arrExec: string[] = [];

            const calls = CB.s( 
                              CB.f (fns.fnTestException,   arrExec, "S0"),
                              CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1")
                          );
    
    
    
            const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
            {
                console.log(error, timeout, objResult );
            }
    
            
            CB.e(calls, 5000, true, true, fnCallback);
        }


        // Invalid param
        if (blnInvalidParam)
        {
            const arrExec: string[] = [];

            const calls =   CB.f (fns.fnTestPrevious0, arrExec, "S0");

            const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
            {
                console.log(error, timeout, objResult );
            }

            
            CB.e(<ExecStruct><unknown>calls, 5000, true, true, fnCallback);
        }

    }
    catch (p_Exception)
    {
        console.log(p_Exception);
    }
})();


/*

0 = SequentialResult {#_Count: 3, 0: FunctionResult, 1: FunctionResult, 2: FunctionResult}
1 = FunctionResult {#_Error: null, #_Results: Array(1)}
2 = FunctionResult {#_Error: Error: Error test\n    at Object.fnTestWithErr… (C:\Repos\GitHub\node-package-callback-hand…, #_Results: Array(0)}
3 = FunctionResult {#_Error: null, #_Results: Array(1)}

Count   = 4
Error   = true
Timeout = false
*/