const blnMixedStructs  = true,
      blnWithErrors    = true,
      blnMoreThan1CB   = true,
      blnWithException = true,
      blnInvalidParam  = true;


export function Test(CB,
                     fns)
{
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
                    console.log(value[1].results);
                })
                .catch( (error) =>
                {
                });
            }
        }
        catch (p_Exception)
        {
            console.log(p_Exception);
        }



        // With error
        try
        {
            if (blnWithErrors)
            {
                const arrResults = [];
            
                const calls   = CB.s( "Parallel calls 1" ,
                                    CB.f (fns.fnTestWithTimeout, arrResults, 300, "P1"),
                                    CB.f ("errAlias", fns.fnTestWithError, arrResults, "P2"),
                                    CB.f (fns.fnTestWithTimeout, arrResults, 500, "P3")
                                );
            
            
                const objResult = await CB.e(calls, 5000, false)
                console.log(objResult[2].error);
                console.log(objResult.getErrors());
            }
        }
        catch (p_Exception)
        {
            console.log(p_Exception);
        }



        // More than 1 callback
        try
        {
            if (blnMoreThan1CB)
            {
                const arrExec = [];

                const calls =   CB.s( "Sequential calls 1" ,
                                    CB.f (fns.fnTestTwoCallbacks, arrExec, "S2"),
                                    CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1"),
                                );

                const objResult = await CB.e(calls, 5000, false);

                console.log(objResult.getErrors());
            }
        }
        catch (p_Exception)
        {
            console.log(p_Exception);
        }




        // Exception in function execution
        try
        {
            if (blnWithException)
            {
                const arrExec = [];

                const calls = CB.s( 
                                CB.f (fns.fnTestException,   arrExec, "S0"),
                                CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1")
                            );



                const fnCallback = (error, timeout, objResult) =>
                { 
                    console.log(error, timeout, objResult );
                }

                CB.e(calls, fnCallback);
            }
        }
        catch (p_Exception)
        {
            console.log(p_Exception);
        }



        // Invalid param
        try
        {
            if (blnInvalidParam)
            {
                console.log("Invalidparam")
                const arrExec = [];

                const calls =   CB.f (fns.fnTestPrevious0, arrExec, "S0");

                const fnCallback = (error, timeout, objResult) =>
                {
                    console.log (error )
                }

                
                console.log(CB.e(calls, 5000, true, true, fnCallback));
            }
        }
        catch (p_Exception)
        {
            console.log(p_Exception);
        }

    })();
}