"use strict";


const util   = require("node:util");
const { CB } = require("./../../lib");
const fns    = require("./../../dist/tests/callback-functions")




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
        
            const arrResults = [];
        
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
                                        CB.f ("fn", 
                                            fns.fnTestPrevious1, arrResults, "___", CB.PREVIOUS_RESULT1)
                                ),
                                CB.s ( "Sequential call 2",
                                        CB.f ("alias", 
                                            fns.fnTest, arrResults, "S5"),
                                        CB.f (fns.fnTest, arrResults, "S6"),
                                        CB.f (fns.fnTest, arrResults, "S7")
                                )
                            );
        
            CB.e(calls, 200000, false, true)
            .then( (value) =>
            {
                console.log(value);
                console.log(value[1].results);
                console.log(util.inspect( value.getByAlias("alias").results, {depth: 5}));
            })
            .catch( (error) =>
            {
            });
        }



        // With error
        if (blnWithErrors)
        {
            const arrResults = [];
        
            const calls   = CB.s( "Parallel calls 1" ,
                                CB.f (fnTestWithTimeout, arrResults, 300, "P1"),
                                CB.f (fnTestWithError, arrResults, "P2"),
                                CB.f (fnTestWithTimeout, arrResults, 500, "P3")
                            );
        
        
            const objResult = await CB.e(calls, 5000, false)
            console.log(objResult);
            console.log(objResult.getByAlias("alias"));

        }



        // More than 1 callback
        if (blnMoreThan1CB)
        {
            const arrExec = [];

            const calls =   CB.s( "Sequential calls 1" ,
                                CB.f (fnTestTwoCallbacks, arrExec, "S2"),
                                CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            );

            const objResult = await CB.e(calls, 5000, false)
        }



        // Exception in function execution
        if (blnWithException)
        {
            const arrExec = [];

            const calls = CB.s( 
                              CB.f (fnTestException,   arrExec, "S0"),
                              CB.f (fnTestWithTimeout, arrExec, 200, "S1")
                          );



            const fnCallback = (error, timeout, objResult) =>
            {
                console.log(error, objResult );
            }

            
            CB.e(calls, 5000, true, true, fnCallback);
        }



        // Invalid param
        if (blnInvalidParam)
        {
            const arrExec = [];

            const calls =   CB.f (fnTestPrevious0, arrExec, "S0");

            const fnCallback = (error, timeout, objResult) =>
            {
                console.log (error )
            }

            
            CB.e(calls, 5000, true, true, fnCallback);
        }
    }
    catch (p_Exception)
    {
        console.log(p_Exception);
    }

})();