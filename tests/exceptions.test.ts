import { CB, 
         FunctionResult, 
         ParallelResult,
         Result,
         SequentialResult }  from "../src";
import { CBException, CBExceptions } from "../src/exceptions";
import { fnTest, 
         fnTestException, 
         fnTestPrevious1, 
         fnTestWithTimeout } from "./callback-functions";



describe ("Exceptions", () =>         
{
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


});