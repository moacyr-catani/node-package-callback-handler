import { CB, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { fnTest, 
         fnTestException, 
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
    10000)



 
});