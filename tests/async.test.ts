import { CB, 
         ExecStruct, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { fnTest, 
         fnTestException, 
         fnTestPrevious0, 
         fnTestPrevious1, 
         fnTestPrevious2, 
         fnTestPrevious3, 
         fnTestPrevious4, 
         fnTestPrevious5,
         fnTestPrevious6,
         fnTestPrevious7,
         fnTestPrevious8,
         fnTestPrevious9,
         fnTestPreviousError,
         fnTestTwoCallbacks,
         fnTestWithError, 
         fnTestWithTimeout } from "./callback-functions";





describe ("Async result", ()=>
{
    test ("Parallel", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestWithTimeout, arrExec, 1000, "P3"),
                            CB.f (fnTestWithTimeout, arrExec,  900, "P4"),
                            CB.f (fnTestWithTimeout, arrExec,  800, "P5"),
                            CB.f (fnTestWithTimeout, arrExec,  700, "P6"),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  600, "P7"),
                        );


        const objResult: Result = await CB.e(calls, 5000);
        const fn7: FunctionResult = <FunctionResult>objResult.getByAlias("fn7");

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("P7");

        expect(arrExec[3])
        .toBe("P4");
        
        expect(arrExec[6])
        .toBe("P1");

        expect( fn7.results[0])
        .toBe("P7 returned from callback");

        expect( objResult[1].error)
        .toBeFalsy();
    })



    test ("Parallel with no alias", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p (
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestWithTimeout, arrExec, 1000, "P3"),
                            CB.f (fnTestWithTimeout, arrExec,  900, "P4"),
                            CB.f (fnTestWithTimeout, arrExec,  800, "P5"),
                            CB.f (fnTestWithTimeout, arrExec,  700, "P6"),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  600, "P7"),
                        );


        const objResult: Result = await CB.e(calls, 5000);

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("P7");

        expect(arrExec[3])
        .toBe("P4");
        
        expect(arrExec[6])
        .toBe("P1");

        expect( objResult.getByAlias("fn7").results[0])
        .toBe("P7 returned from callback");

        expect( objResult[1].error)
        .toBeFalsy();
    })



    test ("Sequential", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fnTestWithTimeout, arrExec, 300, "S3"),
                            CB.f (fnTestWithTimeout, arrExec,  50, "S4"),
                            CB.f (fnTestWithTimeout, arrExec,  20, "S5"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S6"),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  20, "S7"),
                        );


        const objResult: Result = await CB.e(calls, 5000);

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("S1");

        expect(arrExec[3])
        .toBe("S4");
        
        expect(arrExec[6])
        .toBe("S7");

        expect( objResult[0].length)
        .toBe(7);

        expect( objResult[1].results[0])
        .toBe("S1 returned from callback");

        expect( objResult.getByAlias("fn7").results[0])
        .toBe("S7 returned from callback");

        expect( objResult.getByAlias("Sequential calls 1")[0].results[0])
        .toBe("S1 returned from callback");

        expect( objResult[1].error)
        .toBeFalsy();
    })



    test ("Sequential with tokens", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f ("previous0",
                                  fnTestPrevious0,   arrExec, "S0"),
                            CB.f ("previous1",
                                  fnTestPrevious1,   arrExec, "S1", CB.PREVIOUS_RESULT1),
                            CB.f ("previous2",
                                  fnTestPrevious2,   arrExec, "S2", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2),
                            CB.f ("previous3",
                                  fnTestPrevious3,   arrExec, "S3", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3),
                            CB.f ("previous4",
                                  fnTestPrevious4,   arrExec, "S4", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4),
                            CB.f ("previous5",
                                  fnTestPrevious5,   arrExec, "S5", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4, CB.PREVIOUS_RESULT5),
                            CB.f ("previous6",
                                  fnTestPrevious6,   arrExec, "S6", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4, CB.PREVIOUS_RESULT5, CB.PREVIOUS_RESULT6),
                            CB.f ("previous7",
                                  fnTestPrevious7,   arrExec, "S7", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4, CB.PREVIOUS_RESULT5, CB.PREVIOUS_RESULT6, CB.PREVIOUS_RESULT7),
                            CB.f ("previous8",
                                  fnTestPrevious8,   arrExec, "S8", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4, CB.PREVIOUS_RESULT5, CB.PREVIOUS_RESULT6, CB.PREVIOUS_RESULT7, CB.PREVIOUS_RESULT8),
                            CB.f ("previous9",
                                  fnTestPrevious9,   arrExec, "S9", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2, CB.PREVIOUS_RESULT3, CB.PREVIOUS_RESULT4, CB.PREVIOUS_RESULT5, CB.PREVIOUS_RESULT6, CB.PREVIOUS_RESULT7, CB.PREVIOUS_RESULT8, CB.PREVIOUS_RESULT9),
                            CB.f ("previous_Error",
                                  fnTestPreviousError, arrExec, "E", CB.PREVIOUS_ERROR)
                        );


        const objResult:           Result           = await CB.e(calls, 5000);
        const objSequentialResult: SequentialResult = <SequentialResult>objResult[0];

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(objSequentialResult.length)
        .toBe(11);

        expect(arrExec[0])
        .toBe("S0");

        expect(arrExec[1])
        .toBe("S0 S1");
        
        expect(arrExec[2])
        .toBe("S0 S1 S2");

        expect(arrExec[3])
        .toBe("S0 S1 S2 S3");

        expect(arrExec[4])
        .toBe("S0 S1 S2 S3 S4");

        expect(arrExec[5])
        .toBe("S0 S1 S2 S3 S4 S5");

        expect(arrExec[6])
        .toBe("S0 S1 S2 S3 S4 S5 S6");

        expect(arrExec[7])
        .toBe("S0 S1 S2 S3 S4 S5 S6 S7");

        expect(arrExec[8])
        .toBe("S0 S1 S2 S3 S4 S5 S6 S7 S8");

        expect(arrExec[9])
        .toBe("S0 S1 S2 S3 S4 S5 S6 S7 S8 S9");

        expect(arrExec[10])
        .toBe("no error");
    })



    test ("Sequential with tokens and invalid previous result", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f ("previous0",
                                  fnTestPrevious0,   arrExec, "S0"),
                            CB.f ("previous2",
                                  fnTestPrevious2,   arrExec, "S2", CB.PREVIOUS_RESULT1, CB.PREVIOUS_RESULT2)
                        );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()


    })



    test ("Error breaking - parallel", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithError,   arrExec, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );

        const objResult: Result = await CB.e(calls, 5000, true);                        
        

        expect(objResult.error)
        .toBe(true);

        expect( objResult[1].error)
        .toBeTruthy();

        expect( objResult[2])
        .toBeUndefined();
    })



    test ("Error breaking - sequential", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithError,   arrExec, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );

        const objResult: Result = await CB.e(calls, 5000, true);                        
        

        expect(objResult.error)
        .toBe(true);

        expect( objResult[1].error)
        .toBeTruthy();

        expect( objResult[2])
        .toBeUndefined();
    })



    test ("Error non-breaking", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithError,   arrExec, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fnTestWithError,   arrExec, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );

        const objResult: Result = await CB.e(calls, 5000, false);

        
        expect(objResult.error)
        .toBe(true);

        expect( objResult[1].error)
        .toBeTruthy();

        expect( objResult[2].error)
        .toBeFalsy();

        expect( objResult.getErrors().length)
        .toBe(2);

    })
    


    test ("Stats", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fnTestWithTimeout, arrExec, 300, "S3"),
                            CB.f (fnTestWithTimeout, arrExec,  50, "S4"),
                            CB.f (fnTestWithTimeout, arrExec,  20, "S5"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S6"),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  20, "S7"),
                        );

        const objResult: Result = await CB.e(calls, 5000, false, true);

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(objResult.stats)
        .toBeGreaterThanOrEqual(790);

        expect(objResult[0].stats)
        .toBeGreaterThanOrEqual(790);

        expect(objResult[1].stats)
        .toBeGreaterThanOrEqual(200);

        expect(objResult[2].stats)
        .toBeGreaterThanOrEqual(100);
    })



    test ("Stats not gathered", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fnTestWithTimeout, arrExec, 300, "S3"),
                            CB.f (fnTestWithTimeout, arrExec,  50, "S4"),
                            CB.f (fnTestWithTimeout, arrExec,  20, "S5"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S6"),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  20, "S7"),
                        );

        const objResult: Result = await CB.e(calls, 5000, false, false);

        expect(objResult.timeout)
        .toBe(false);

        expect(objResult.error)
        .toBe(false);

        expect(() => objResult.stats)
        .toThrow();

        expect(() => objResult[0].stats)
        .toThrow();
        
        expect(() => objResult[1].stats)
        .toThrow();
    })



    test ("Timeout", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls, 50);

        expect(objResult.timeout)
        .toBe(true);
    })



    test ("Timeout - default", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls);

        expect(objResult.timeout)
        .toBe(false);
    })



    test ("Negative timeout", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls, -50);

        expect(objResult.timeout)
        .toBe(false);
    })



    test ("Result iterator", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls, -50);
        let intIterator: number = 0;

        for (let itemResult of objResult)
        {
            intIterator++;
        }

        expect(intIterator)
        .toBe(3);


        intIterator = 0;
        for (let itemResult of objResult[0])
        {
            intIterator++;
        }

        expect(intIterator)
        .toBe(2);
    })



    test ("Function result iterator", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls, -50);
        let intIterator: number = 0;

        for (let itemResult of objResult[1])
        {
            intIterator++;
        }

        expect(intIterator)
        .toBe(0);

        expect(objResult[1].length)
        .toBe(0);

    })



    test ("Callback more than once", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestTwoCallbacks, arrExec, "S2"),
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                        );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    })



    test ("Exception in execution", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestException,   arrExec, "P3"),
                            CB.s ( 
                                "Sequential call 1",
                                CB.f (fnTest, arrExec, "S1"),
                                CB.f (fnTest, arrExec, "S2"),
                                CB.f (fnTest, arrExec, "S3"),
                                CB.p ( 
                                    "Parallel calls in a sequence call",
                                    CB.f (fnTestWithTimeout, arrExec, 1200, "S4 P1"),
                                    CB.f (fnTestWithTimeout, arrExec, 1100, "S4 P2"),
                                    CB.f (fnTestWithTimeout, arrExec, 1000, "S4 P3")
                                )
                            ),
                            CB.s ( 
                                CB.f ("alias", fnTest, arrExec, "S5"),
                                CB.f (fnTest, arrExec, "S6"),
                                CB.f (fnTest, arrExec, "S7")
                            )
                        );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    })



    test ("Nested calls", async () =>
    {
        const arrExec: string[] = [];

        const calls: ExecStruct = CB.p( "Parallel calls 1" ,
                                        CB.f (fnTestWithTimeout, arrExec, 300, "P1"),
                                        CB.f (fnTestWithTimeout, arrExec, 200, "P2"),
                                        CB.f (fnTestWithTimeout, arrExec, 100, "P3"),
                                        CB.s ( "Sequential call 1",
                                                CB.f (fnTest, arrExec, "S1"),
                                                CB.f (fnTest, arrExec, "S2"),
                                                CB.f (fnTest, arrExec, "S3"),
                                                CB.p ( "Parallel calls in a sequence call",
                                                        CB.f (fnTestWithTimeout, arrExec, 300, "S4 P1"),
                                                        CB.f (fnTestWithTimeout, arrExec, 200, "S4 P2"),
                                                        CB.f (fnTestWithTimeout, arrExec, 100, "S4 P3")
                                                )
                                        ),
                                        CB.s ( "Sequential call 2",
                                                CB.f ("alias", 
                                                    fnTest, arrExec, "S5"),
                                                CB.f (fnTestPrevious1, arrExec, "S6", CB.PREVIOUS_RESULT1),
                                                CB.f (fnTest, arrExec, "S7")
                                        )
                                    );
        const objResult: Result = await CB.e(calls, 5000);

        expect(objResult[0].results[3][3][2][0])
        .toBe("S4 P3 returned from callback");

        expect(objResult[0].error[3][3][2])
        .toBe(null);
    })



    test ("Sequential calls with struct as previous ", async () =>
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
                                            CB.f (fnTestWithTimeout, arrResults, 100, "S4 P3"),
                                            CB.s ( "Sequential call 1",
                                                   CB.f (fnTest, arrResults, "S1"),
                                                   CB.f (fnTest, arrResults, "S2"),
                                                   CB.f (fnTest, arrResults, "S3")
                                            )
                                    ),
                                    //CB.f ("fn",fnTest, arrResults, "___")
                                    CB.f ("fn",fnTestPrevious1, arrResults, "___", CB.PREVIOUS_RESULT1)
                            ),
                            CB.s ( "Sequential call 2",
                                    CB.f ("alias", 
                                          fnTest, arrResults, "S5"),
                                    CB.f (fnTest, arrResults, "S6"),
                                    CB.f (fnTest, arrResults, "S7")
                            )
                        );
    
        const objResult: Result = await CB.e(calls, 5000)


        expect( Array.isArray(objResult[16].results[1]) )
        .toBe(true);
    })



    test ("Sequential calls with struct as previous with invalid request ", async () =>
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
                                            CB.f (fnTestWithTimeout, arrResults, 100, "S4 P3"),
                                            CB.s ( "Sequential call 1",
                                                   CB.f (fnTest, arrResults, "S1"),
                                                   CB.f (fnTest, arrResults, "S2"),
                                                   CB.f (fnTest, arrResults, "S3")
                                            )
                                    ),
                                    //CB.f ("fn",fnTest, arrResults, "___")
                                    CB.f ("fn",fnTestPrevious1, arrResults, "___", CB.PREVIOUS_RESULT3)
                            ),
                            CB.s ( "Sequential call 2",
                                    CB.f ("alias", 
                                          fnTest, arrResults, "S5"),
                                    CB.f (fnTest, arrResults, "S6"),
                                    CB.f (fnTest, arrResults, "S7")
                            )
                        );
    
        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    })
});