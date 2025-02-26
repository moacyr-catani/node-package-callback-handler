import { CallsStruct, CallTypes, ExecStruct, RootStruct } from "./calls-struct";
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




export class ExecStructResult
{
    constructor()
    {
        this.#_Errors  = [];
        this.#_Results = [];

        Object.seal(this);
    }


    // Private holders
    #_Errors:  any[];
    #_Results: any[];



    // Public properties
    public get Errors():  any { return this.#_Errors}
    public get Results(): any { return this.#_Results}



    // Public methods
    public AddResult(p_Index: number, p_Error: any, p_Results: any)
    {
        this.#_Errors[p_Index]  = p_Error;
        this.#_Results[p_Index] = p_Results;
    }
}




export class Result 
{
    constructor(p_RootStruct:  RootStruct,
                p_Timeout:     number,
                p_StopOnError: boolean,
                p_onFinish:    Function)
    {
        this.#_CallsCount  = p_RootStruct.PlainCalls.length;
        this.#_onFinish    = p_onFinish;
        this.#_RootStruct  = p_RootStruct;
        this.#_StopOnError = p_StopOnError;

        this.#_CallResults = new Array(this.#_CallsCount).fill(false);

        this.#_TimeoutPtr  = setTimeout(() =>
                                        { 
                                            this.#_Finish(undefined, true);
                                        },
                                        p_Timeout)
    }


    // ----------------------------------------------------------------------------------------------------------------
    // #region Private fields
    // ----------------------------------------------------------------------------------------------------------------

    #_Error:        boolean = false;
    #_Timeout:      boolean = false;

    #_AliasResult:  Record<string, CallResult> = {};
    #_CallResults:  Array<boolean>;

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

    public get CallsCount(): number
    {
        return this.#_CallsCount;
    }



    public get Error(): boolean
    {
        return this.#_Error;
    }



    public get Timeout(): boolean
    {
        return this.#_Timeout;
    }



    [key:number]: CallResult | ExecStructResult;



    [Symbol.iterator]() 
    {
        let index = 0;
        const data = this;
        return {
            next() 
            {
                if (index <= data.CallsCount) 
                    return { value: data[index++], done: false };
                else 
                    return { done: true };
            }
        }
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------






    // ----------------------------------------------------------------------------------------------------------------
    // #region Private methods
    // ----------------------------------------------------------------------------------------------------------------
    
    #_Finish(p_Exception?: Error,
             p_Timeout?:   boolean): void
    {
        if (p_Timeout)
            this.#_Timeout = true;

        clearTimeout(this.#_TimeoutPtr);

        delete this.SetException;
        delete this.SetResult;

        this.#_onFinish(p_Exception);
    }



    #_SetParentResult(p_Parent:      ExecStruct | null, 
                      p_ParentIndex: number,
                      p_Error:       any,
                      p_Results:     any[]|null): void
    {
        // Set parent results and errors
        if (p_Parent)
        {
            if (!this[p_Parent.RootIndex])
                this[p_Parent.RootIndex] = new ExecStructResult();

            (<ExecStructResult>this[p_Parent.RootIndex]).AddResult(p_ParentIndex,
                                                                   p_Error,
                                                                   p_Results);

            this.#_SetParentResult(p_Parent.Parent,
                                   p_Parent.ParentIndex,
                                   p_Error,
                                   p_Results);
        }
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

    

    public ByPosition(p_Position: number): CallResult | ExecStructResult
    {
        return this[p_Position];

        // const structCall: CallsStruct | ExecStruct = this.#_RootStruct.PlainCalls[p_Position];

        // if (structCall.Type === CallTypes.Function)
        //     return new CallResult(structCall.Error, structCall.Results);
        // else
        //     return new CallResult(structCall.Errors, structCall.Results);
    }



    public SetException?(p_Index:     number, 
                         p_Alias:     string, 
                         p_Exception: Error)
    {
        (<CBException>p_Exception).details = `Call alias: "${p_Alias}"\nCall index: ${p_Index}`,

        this.#_Finish(p_Exception);
    }



    public SetResult?(p_Index:   number, 
                      p_Alias:   string, 
                      p_Error:   any, 
                      p_Stats:   number, 
                      p_Results: any[] | null): void
    {
        // Check if result has already been set
        if (this.#_CallResults[p_Index])
        {
            this.SetException!(p_Index, p_Alias, new CBException(CBExceptions.ResultAlreadySet));
            return;
        }
        else
            this.#_CallResults[p_Index] = true;



        // Result
        const objResult: CallResult = new CallResult(p_Error, p_Results);



        // Store result in dictionary
        if (p_Alias !== "")
            this.#_AliasResult[p_Alias] = objResult;



        // Indexed property
        this[p_Index] = objResult;



        // Set parent result
        const callStruct = this.#_RootStruct.PlainCalls[p_Index]
        this.#_SetParentResult(callStruct.Parent, 
                               callStruct.ParentIndex,
                               p_Error,
                               p_Results);



        // Check error
        if (p_Error)
        {
            this.#_Error = true;

            if (this.#_StopOnError)
                this.#_Finish();
        }



        // Increment # calls that returned
        this.#_ResultsCount++;



        // If all calls returned, finish 
        if (this.#_ResultsCount >= this.#_CallsCount)
            this.#_Finish();
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------

}