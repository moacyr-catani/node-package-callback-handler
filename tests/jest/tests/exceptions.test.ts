import { CB,
         Result}        from "../../../src";
import { CBException, 
         CBExceptions } from "../../../src/exception";
import { CallTypes,
         ExecStruct}    from "../../../src/calls-struct"
import * as fns         from "../../common/callback-functions";



describe ("Exceptions", () =>         
{
    test ("Exception - async", async () =>
    {
        const arrExec: string[] = [];

        const calls = CB.s( 
                          CB.f (fns.fnTestException,   arrExec, "S0"),
                          CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1")
                      );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()
    });



    test ("Exception - callback", (done) =>
    {

        const arrExec: string[] = [];

        const calls = CB.s( 
                          CB.f (fns.fnTestException,   arrExec, "S0"),
                          CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1")
                      );



        const fnCallback = (error: any, timeout: boolean, objResult: Result) =>
        {
            expect (timeout )
            .toBeUndefined();

            expect (error )
            .toBeInstanceOf(CBException);

            expect (objResult )
            .toBeUndefined();

            done();
        }

        
        CB.e(calls, 5000, true, true, fnCallback);
    })



    test ("Sequential with tokens in first call", () =>
    {
        const arrExec: string[] = [];

        expect(() => 
        {
            CB.s( "Sequential calls 1" ,
                CB.f ("previous",
                      fns.fnTestPrevious1,   arrExec, "S0", CB.PREVIOUS_RESULT1),
                CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1")
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
                CB.f (fns.fnTestWithTimeout, arrExec, 200, "S1"),
                CB.f (fns.fnTestPrevious1,   arrExec, "S0", CB.PREVIOUS_RESULT1)
            )
        })
        .toThrow()
    });



    test ("Exception with details", () =>
    {
        const errTest: CBException = new CBException(CBExceptions.InternalError, {callAlias: "alias", callIndex: 1}, "stack", new Error("Error test"));

        expect(errTest.details?.callAlias)
        .toBe("alias")

        expect(errTest.details?.callIndex)
        .toBe(1)

    });



    test ("Exception with no explanation", () =>
    {
        const errTest: CBException = new CBException(CBExceptions.NoError);

        expect( !("explanation" in errTest) )
        .toBe(true)
    });


    
    test ("Wrong function signature", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.s( "Sequential calls 1" ,
                            CB.f ("previous0",
                                  fns.fnTestPrevious0,   arrExec, "S0"),
                            CB.f ("previous2",
                                  fns.fnTestPrevious2,   arrExec, "S2", CB.PREVIOUS_RESULT1)
                        );


        await expect(CB.e(calls, 5000, true))
        .rejects
        .toThrow()

        // expect(async () => await CB.e(calls, 5000, true))
        // .toThrow()

    })



    test ("Wrong struct definition to execute - async", async () =>
    {
        const arrExec: string[] = [];

        const calls =   CB.f (fns.fnTestPrevious0,   arrExec, "S0");


        expect(() => CB.e(<ExecStruct><unknown>calls, 5000, true))
        .toThrow()
    })


    
    test ("Wrong struct definition to execute - callback", (done) =>
    {
        const arrExec: string[] = [];

        const calls =   CB.f (fns.fnTestPrevious0, arrExec, "S0");

        const fnCallback = (error: any) =>
        {
            expect (error )
            .toBeInstanceOf(CBException);

            done();
        }
        
        CB.e(<ExecStruct><unknown>calls, 5000, true, true, fnCallback);
    })
    

    
    test ("Invalid param - async", async () =>
    {
        expect(() => CB.e(<ExecStruct><unknown>{Type: CallTypes.Parallel}, 5000, true))
        .toThrow()
    })



    test ("Invalid param - callback", (done) =>
    {
        const fnCallback = (error: any) =>
            {
                expect (error )
                .toBeInstanceOf(CBException);
    
                done();
            }

        CB.e(<ExecStruct><unknown>{Type: CallTypes.Parallel}, 5000, true, fnCallback);
        
    })
});