import { CallsStruct, ExecStruct, RootStruct } from "./calls-struct";
import { CBException, CBExceptions } from "./exceptions";

export class CallResult
{
    constructor(p_Error: any, p_Results: any)
    {
        this.#_Error   = p_Error;
        this.#_Results = p_Results;

        Object.seal(this);
    }


    // Private holders
    #_Error:   any;
    #_Results: any;


    // Public properties
    public get Error():   any { return this.#_Error}
    public get Results(): any { return this.#_Results}
}





export class Result 
{
    constructor(p_RootStruct:  RootStruct,
                p_Timeout:     number,
                p_StopOnError: boolean,
                p_onFinish:    Function)
    {
        this.#_CallsCount  = p_RootStruct.CallSize;
        this.#_onFinish    = p_onFinish;
        this.#_RootStruct  = p_RootStruct;
        this.#_StopOnError = p_StopOnError;

        this.#_TimeoutPtr  = setTimeout(() =>
                                        { 
                                            this.#_Timeout = true;
                                            this.#_onFinish();
                                        },
                                        p_Timeout)
    }


    // ----------------------------------------------------------------------------------------------------------------
    // #region Private fields
    // ----------------------------------------------------------------------------------------------------------------

    #_Error:        boolean = false;
    #_Timeout:      boolean = false;

    #_AliasResult:  Record<string, CallResult> = {};
    #_CallResults:  Array<CallResult> = [];

    #_StopOnError:  boolean = false;
    #_ResultsCount: number = 0;
    #_CallsCount:   number = 0;

    #_onFinish:     Function;
    #_RootStruct:   RootStruct;
    #_TimeoutPtr:   NodeJS.Timeout;

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public properties
    // ----------------------------------------------------------------------------------------------------------------

    public get Error(): boolean
    {
        return this.#_Error;
    }



    public get Results(): Array<CallResult>
    {
        return this.#_CallResults;
    }



    public get Timeout(): boolean
    {
        return this.#_Timeout;
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public methods
    // ----------------------------------------------------------------------------------------------------------------

    public ByAlias(p_Alias: string): CallResult
    {
        return this.#_AliasResult[p_Alias];
    }

    

    public ByPosition(p_Position: number): CallResult
    {
        const structCall: CallsStruct | ExecStruct = this.#_RootStruct.PlainCalls[p_Position];
        return new CallResult(structCall.Error, structCall.Results);
    }



    public SetException?(p_Index:     number, 
                         p_Alias:     string, 
                         p_Exception: Error)
    {
        delete this.SetException;
        delete this.SetResult;


        (<CBException>p_Exception).details = `Call alias: "${p_Alias}"\nCall index: ${p_Index}`,

        this.#_onFinish(p_Exception);
    }



    public SetResult?(p_Index:   number, 
                      p_Alias:   string, 
                      p_Error:   any, 
                      p_Stats:   number, 
                      p_Results: any[] | null): void
    {
        // Store result in ordered array
        this.#_CallResults[p_Index] = new CallResult(p_Error, p_Results);


        // Store result in dictionary
        if (p_Alias !== "")
            this.#_AliasResult[p_Alias] = new CallResult(p_Error, p_Results);


        // Check error
        if (p_Error)
        {
            this.#_Error = true;

            if (this.#_StopOnError)
                this.#_onFinish();
        }


        // Increment # calls that returned
        this.#_ResultsCount++;


        // If all calls returned, finish 
        if (this.#_ResultsCount >= this.#_CallsCount)
        {
            clearTimeout(this.#_TimeoutPtr);

            delete this.SetException;
            delete this.SetResult;

            this.#_onFinish();
        }
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------

}