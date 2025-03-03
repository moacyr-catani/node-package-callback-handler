import { CB, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { fnTest, 
         fnTestException, 
         fnTestPrevious1, 
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

        expect(objResult.Timeout)
        .toBe(false);

        expect(objResult.Error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("P7");

        expect(arrExec[3])
        .toBe("P4");
        
        expect(arrExec[6])
        .toBe("P1");

        expect( objResult.ByAlias("fn7").Results[0])
        .toBe("P7 returned from callback");

        expect( objResult[1].Error)
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

        expect(objResult.Timeout)
        .toBe(false);

        expect(objResult.Error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("S1");

        expect(arrExec[3])
        .toBe("S4");
        
        expect(arrExec[6])
        .toBe("S7");

        expect( objResult[1].Results[0])
        .toBe("S1 returned from callback");

        expect( objResult.ByAlias("fn7").Results[0])
        .toBe("S7 returned from callback");

        expect( objResult.ByAlias("Sequential calls 1")[0].Results[0])
        .toBe("S1 returned from callback");

        expect( objResult[1].Error)
        .toBeFalsy();
    })



    test ("Sequential with tokens", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fnTestWithTimeout, arrExec, 300, "S3"),
                            CB.f (fnTestWithTimeout, arrExec,  50, "S4"),
                            CB.f (fnTestWithTimeout, arrExec,  20, "S5"),
                            CB.f ("previous",
                                  fnTestPrevious1,   arrExec, "S6", CB.PREVIOUS_RESULT1),
                            CB.f ("fn7",
                                  fnTestWithTimeout, arrExec,  20, "S7"),
                        );


        const objResult: Result = await CB.e(calls, 5000);

        expect(objResult.Timeout)
        .toBe(false);

        expect(objResult.Error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("S1");

        expect(arrExec[3])
        .toBe("S4");
        
        expect(arrExec[6])
        .toBe("S7");

        expect( objResult[1].Results[0])
        .toBe("S1 returned from callback");

        expect( objResult.ByAlias("previous").Results[0])
        .toBe("S6 S5 returned from callback returned from callback");

        expect( objResult.ByAlias("fn7").Results[0])
        .toBe("S7 returned from callback");

        expect( objResult.ByAlias("Sequential calls 1")[0].Results[0])
        .toBe("S1 returned from callback");

        expect( objResult[1].Error)
        .toBeFalsy();
    })


    test ("Error breaking", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithError,   arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );

        const objResult: Result = await CB.e(calls, 5000, true);                        
        

        expect(objResult.Error)
        .toBe(true);

        expect( objResult[1].Error)
        .toBeTruthy();
    })




    test ("Error non-breaking", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithError,   arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    })
    



    test ("Timeout", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );


        const objResult: Result = await CB.e(calls, 50);

        expect(objResult.Timeout)
        .toBe(true);
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
});