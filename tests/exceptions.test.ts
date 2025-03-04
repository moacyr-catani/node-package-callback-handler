import { CB, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { CBException, 
         CBExceptions }      from "../src/exceptions";
import { BaseStruct,
         CallTypes,
         CallsStruct,
         ExecStruct,
         RootStruct}         from "../src/calls-struct"
import { fnTest, 
         fnTestException, 
         fnTestPrevious0, 
         fnTestPrevious1, 
         fnTestPrevious2, 
         fnTestWithTimeout } from "./callback-functions";



describe ("Exceptions", () =>         
{
    test ("Exception - async", async () =>
    {
        const arrExec: string[] = [];

        const calls = CB.s( 
                          CB.f (fnTestException,   arrExec, "S0"),
                          CB.f (fnTestWithTimeout, arrExec, 200, "S1")
                      );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    });



    test ("Exception - callback", (done) =>
    {

        const arrExec: string[] = [];

        const calls = CB.s( 
                          CB.f (fnTestException,   arrExec, "S0"),
                          CB.f (fnTestWithTimeout, arrExec, 200, "S1")
                      );



        const fnCallback = (error: any, objResult: Result) =>
        {
            done();
        }

        
        expect( CB.e(calls, 5000, true, true, fnCallback) )
        .toThrow();
    }, 
    20000)



    test ("Sequential with tokens in first call", () =>
    {
        const arrExec: string[] = [];

        expect(() => 
        {
            CB.s( "Sequential calls 1" ,
                CB.f ("previous",
                      fnTestPrevious1,   arrExec, "S0", CB.PREVIOUS_RESULT1),
                CB.f (fnTestWithTimeout, arrExec, 200, "S1")
            )
        })
        .toThrow()
    });



    test ("Parallel with tokens", () =>
    {
        const arrExec: string[] = [];

        expect(() => 
        {
            CB.p ( 
                "Sequential calls 1" ,
                CB.f (fnTestWithTimeout, arrExec, 200, "S1"),
                CB.f (fnTestPrevious1,   arrExec, "S0", CB.PREVIOUS_RESULT1)
            )
        })
        .toThrow()
    });



    test ("Exception with details", () =>
    {
        const errTest: CBException = new CBException(CBExceptions.InternalError, "Details", "stack", new Error("Error test"));

        expect(errTest.details)
        .toBe("Details")
    });



    test ("Wrong function signature", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f ("previous0",
                                  fnTestPrevious0,   arrExec, "S0"),
                            CB.f ("previous2",
                                  fnTestPrevious2,   arrExec, "S2", CB.PREVIOUS_RESULT1)
                        );


        // await expect(CB.e(calls, 5000, true))
        // .rejects
        // .toThrow()

        expect(() => CB.e(calls, 5000, true))
        .toThrow()

    })



    test ("Wrong struct definition to execute", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.f ("previous0",
                              fnTestPrevious0,   arrExec, "S0");


        expect(() => CB.e(<ExecStruct><unknown>calls, 5000, true))
        .toThrow()
    })


    
    test ("Invalid param - async", async () =>
    {
        expect(() => CB.e(<ExecStruct><unknown>{Type: CallTypes.Parallel}, 5000, true))
        .toThrow()
    })



    test ("Invalid param - callback", () =>
    {
        expect(() => CB.e(<ExecStruct><unknown>{Type: CallTypes.Parallel}, 5000, true, (error, result) => console.log(error, result)))
        .toThrow()
    })
});