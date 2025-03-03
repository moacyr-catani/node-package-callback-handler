import { FunctionResult, SequentialResult } from "../src/result";
import { CB, 
         Result } from "./../src";




const fnTestWithTimeout: Function = function(p_Array:    string[],
                                             p_Timeout:  number,
                                             p_Value:    string, 
                                             p_Callback: Function)
{
    setTimeout( () =>
    {
        p_Array.push(p_Value);
        p_Callback(null, p_Value + " returned from callback");
    }, 
    p_Timeout);
}



const fnTest: Function = (p_Array:    string[],
                          p_Value:    string, 
                          p_Callback: Function) =>
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value + " returned from callback");
}


const fnTestException: Function = (p_Array:    string[],
                                  p_Value:    string, 
                                  p_Callback: Function) =>
{
    throw new Error("Error in fn");
}




describe ("Parallel execution", ()=>
{
    test ("Async", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestWithTimeout, arrExec, 1000, "P3"),
                            CB.s ( "Sequential call 1",
                                    CB.f (fnTest, arrExec, "S1"),
                                    CB.f (fnTest, arrExec, "S2"),
                                    CB.f (fnTest, arrExec, "S3"),
                                    CB.p ( "Parallel calls in a sequence call",
                                            CB.f (fnTestWithTimeout, arrExec, 1200, "S4 P1"),
                                            CB.f (fnTestWithTimeout, arrExec, 1100, "S4 P2"),
                                            CB.f (fnTestWithTimeout, arrExec, 1000, "S4 P3")
                                    )
                            ),
                            CB.s ( "Sequential call 2",
                                    CB.f ("alias", fnTest, arrExec, "S5"),
                                    CB.f (fnTest, arrExec, "S6"),
                                    CB.f (fnTest, arrExec, "S7")
                            )
                        );


        const objResult: Result = await CB.e(calls, 5000);

        expect(objResult.Timeout)
        .toBe(false);

        expect(objResult.Error)
        .toBe(false);

        expect(arrExec[0])
        .toBe("S1");

        expect( (<FunctionResult>objResult.ByAlias("alias")).Results[0])
        .toBe("S5 returned from callback");

        expect( (<FunctionResult>objResult[1]).Error)
        .toBe(null);

        expect( (<FunctionResult>objResult[1]).Results[0])
        .toBe("P1 returned from callback");

        expect( (<FunctionResult>(<SequentialResult>objResult[4])[0]).Error)
        .toBe(null);

        expect( (<FunctionResult>(<SequentialResult>objResult[4])[0]).Results[0])
        .toBe("S1 returned from callback");

    })




    test ("Callback", (done) =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( "Parallel calls 1" ,
                            CB.f (fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fnTestWithTimeout, arrExec, 1000, "P3"),
                            CB.s ( "Sequential call 1",
                                    CB.f (fnTest, arrExec, "S1"),
                                    CB.f (fnTest, arrExec, "S2"),
                                    CB.f (fnTest, arrExec, "S3"),
                                    CB.p ( "Parallel calls in a sequence call",
                                            CB.f (fnTestWithTimeout, arrExec, 1200, "S4 P1"),
                                            CB.f (fnTestWithTimeout, arrExec, 1100, "S4 P2"),
                                            CB.f (fnTestWithTimeout, arrExec, 1000, "S4 P3")
                                    )
                            ),
                            CB.s ( "Sequential call 2",
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

            expect( (<FunctionResult>objResult.ByAlias("alias")).Results[0])
            .toBe("S5 returned from callback");

            expect( (<FunctionResult>objResult[1]).Error)
            .toBe(null);

            expect( (<FunctionResult>objResult[1]).Results[0])
            .toBe("P1 returned from callback");

            expect( (<FunctionResult>(<SequentialResult>objResult[4])[0]).Error)
            .toBe(null);

            expect( (<FunctionResult>(<SequentialResult>objResult[4])[0]).Results[0])
            .toBe("S1 returned from callback");

            done();
        }


        CB.e(calls, 5000, fnCallback);
    }, 
    10000)



    test ("Async + exception", async () =>
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
    
    
            await expect(CB.e(calls, 5000))
            .rejects
            .toThrow()
        })
    
});