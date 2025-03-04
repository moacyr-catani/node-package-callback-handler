import { CB, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { fnTest, 
         fnTestException, 
         fnTestWithError, 
         fnTestWithTimeout } from "./callback-functions";




describe ("Callback", ()=>
{
    test ("Nested structs", (done) =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( 
                            "Parallel calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestWithTimeout, arrExec, 1000, "P3"),
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
                                "Sequential call 2",
                                CB.f ("alias", fnTest, arrExec, "S5"),
                                CB.f (fnTest, arrExec, "S6"),
                                CB.f (fnTest, arrExec, "S7")
                            )
                        );


        const fnCallback = (error: any, objResult: Result) =>
        {
            expect(objResult.Timeout)
            .toBe(false);

            expect(objResult.Error)
            .toBe(false);

            expect(arrExec[0])
            .toBe("S1");

            expect( objResult.ByAlias("alias").Results[0])
            .toBe("S5 returned from callback");

            expect( objResult[1].Error)
            .toBe(null);

            expect( objResult[1].Results[0] )
            .toBe("P1 returned from callback");

            expect( objResult[4][0].Error)
            .toBe(null);

            expect( objResult[4][0].Results[0] )
            .toBe("S1 returned from callback");

            done();
        }


        CB.e(calls, 5000, fnCallback);
    }, 
    20000)



    test ("Break on error", (done) =>
    {

        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithError,   arrExec, "S1"),
                            CB.f (fnTestWithTimeout, arrExec, 100, "S2")
                        );



        const fnCallback = (error: any, objResult: Result) =>
        {
            expect(objResult.Error)
            .toBe(true);
    
            expect( objResult[1].Error)
            .toBeTruthy();
    
            expect( objResult[2])
            .toBeUndefined();

            
            done();
        }


        CB.e(calls, 5000, true, fnCallback);
    }, 
    20000)
 


    test ("Stats", (done) =>
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



        const fnCallback = (error: any, objResult: Result) =>
        {
            expect(objResult.Timeout)
            .toBe(false);
    
            expect(objResult.Error)
            .toBe(false);
    
            expect(objResult.Stats)
            .toBeGreaterThanOrEqual(790);
    
            expect(objResult[0].Stats)
            .toBeGreaterThanOrEqual(790);
    
            expect(objResult[1].Stats)
            .toBeGreaterThanOrEqual(200);
    
            expect(objResult[2].Stats)
            .toBeGreaterThanOrEqual(100);
    
            
            done();
        }


        CB.e(calls, 5000, true, true, fnCallback);
    }, 
    20000)
 
});