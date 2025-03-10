import { CB,
         Result }  from "../../../src";
         import * as fns from "../../common/callback-functions";



describe ("Callback", ()=>
{
    test ("Nested structs", (done) =>
    {
        const arrExec: string[] = [];

        const calls =   CB.p( 
                            "Parallel calls 1" ,
                            CB.f (fns.fnTestWithTimeout, arrExec, 1200, "P1"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 1100, "P2"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 1000, "P3"),
                            CB.s ( 
                                "Sequential call 1",
                                CB.f (fns.fnTest, arrExec, "S1"),
                                CB.f (fns.fnTest, arrExec, "S2"),
                                CB.f (fns.fnTest, arrExec, "S3"),
                                CB.p ( 
                                    "Parallel calls in a sequence call",
                                    CB.f (fns.fnTestWithTimeout, arrExec, 1200, "S4 P1"),
                                    CB.f (fns.fnTestWithTimeout, arrExec, 1100, "S4 P2"),
                                    CB.f (fns.fnTestWithTimeout, arrExec, 1000, "S4 P3")
                                )
                            ),
                            CB.s (
                                "Sequential call 2",
                                CB.f ("alias", fns.fnTest, arrExec, "S5"),
                                CB.f (fns.fnTest, arrExec, "S6"),
                                CB.f (fns.fnTest, arrExec, "S7")
                            )
                        );


        const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
        {
            expect(timeout)
            .toBe(false);

            expect(error)
            .toBe(false);

            expect(objResult.timeout)
            .toBe(false);

            expect(objResult.error)
            .toBe(false);

            expect(arrExec[0])
            .toBe("S1");

            expect( objResult.getByAlias("alias").results[0])
            .toBe("S5 returned from callback");

            expect( objResult[1].error)
            .toBe(null);

            expect( objResult[1].results[0] )
            .toBe("P1 returned from callback");

            expect( objResult[4][0].error)
            .toBe(null);

            expect( objResult[4][0].results[0] )
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
                            CB.f (fns.fnTestWithError,   arrExec, "S1"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 100, "S2")
                        );



        const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
        {
            expect(error)
            .toBe(true);

            expect(timeout)
            .toBe(false);

            expect(objResult.error)
            .toBe(true);
    
            expect( objResult[1].error)
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
                            CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 100, "S2"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 300, "S3"),
                            CB.f (fns.fnTestWithTimeout, arrExec,  50, "S4"),
                            CB.f (fns.fnTestWithTimeout, arrExec,  20, "S5"),
                            CB.f (fns.fnTestWithTimeout, arrExec, 100, "S6"),
                            CB.f ("fn7",
                                  fns.fnTestWithTimeout, arrExec,  20, "S7"),
                        );



        const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
        {
            expect(timeout)
            .toBe(false);
    
            expect(error)
            .toBe(false);

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
    
            
            done();
        }


        CB.e(calls, 5000, true, true, fnCallback);
    }, 
    20000)
 


    test ("Default timeout", (done) =>
        {
    
            const arrExec: string[] = [];
    
            const calls =   CB.s( "Sequential calls 1" ,
                                CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1"),
                                CB.f (fns.fnTestWithTimeout, arrExec, 100, "S2"),
                                CB.f (fns.fnTestWithTimeout, arrExec, 300, "S3"),
                                CB.f (fns.fnTestWithTimeout, arrExec,  50, "S4"),
                                CB.f (fns.fnTestWithTimeout, arrExec,  20, "S5"),
                                CB.f (fns.fnTestWithTimeout, arrExec, 100, "S6"),
                                CB.f ("fn7",
                                      fns.fnTestWithTimeout, arrExec,  20, "S7"),
                            );
    
    
    
            const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
            {
                expect(timeout)
                .toBe(false);
        
                expect(error)
                .toBe(false);
    
                expect(objResult.timeout)
                .toBe(false);
        
                expect(objResult.error)
                .toBe(false);
        
                
                done();
            }
    
    
            CB.e(calls, fnCallback);
        }, 
        20000)
     
});