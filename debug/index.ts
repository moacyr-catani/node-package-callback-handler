import util from "node:util";
import { CB, 
         Result } from "./../src";

import { fnTest,
         fnTestException,
         fnTestPrevious1,
         fnTestWithError,
         fnTestWithTimeout} from "./../tests/callback-functions"



(async ()=>
{
    try
    {
        // Mixed structs
        if (false)
        {
        
            const arrResults: any[] = [];
        
            const calls   = CB.p( "Parallel calls 1" ,
                                CB.f (fnTestWithTimeout, arrResults, 300, "P1"),
                                CB.f (fnTestWithTimeout, arrResults, 200, "P2"),
                                CB.f (fnTestWithTimeout, arrResults, 100, "P3"),
                                CB.s ( "Sequential call 1",
                                        CB.f (fnTest, arrResults, "S1"),
                                        CB.f (fnTest, arrResults, "S2"),
                                        CB.f (fnTest, arrResults, "S3"),
                                        CB.p ( "Parallel calls in a sequence call",
                                                CB.f (fnTestWithTimeout, arrResults, 300, "S4 P1"),
                                                CB.f (fnTestWithTimeout, arrResults, 200, "S4 P2"),
                                                CB.f (fnTestWithTimeout, arrResults, 100, "S4 P3")
                                        )
                                ),
                                CB.s ( "Sequential call 2",
                                        CB.f ("alias", 
                                              fnTest, arrResults, "S5"),
                                        CB.f (fnTestPrevious1, arrResults, "S6", CB.PREVIOUS_RESULT1),
                                        CB.f (fnTest, arrResults, "S7")
                                )
                            );
        
        
            const objResult: Result = await CB.e(calls, 5000)
            console.log(objResult);
            console.log(objResult.ByAlias("alias"));
        }



        // With error
        if (true)
        {
            const arrResults: any[] = [];
        
            const calls   = CB.s( "Parallel calls 1" ,
                                CB.f (fnTestWithTimeout, arrResults, 300, "P1"),
                                CB.f (fnTestWithError, arrResults, "P2"),
                                CB.f (fnTestWithTimeout, arrResults, 500, "P3")
                            );
        
        
            const objResult: Result = await CB.e(calls, 5000, false)
            console.log(objResult);
            console.log(objResult.ByAlias("alias"));

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