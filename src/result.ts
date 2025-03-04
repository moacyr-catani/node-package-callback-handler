import { CallsStruct, 
         CallTypes, 
         ExecStruct, 
         RootStruct }   from "./calls-struct";
import { CBException, 
         CBExceptions } from "./exceptions";




export class FunctionResult
{
    constructor(p_Error:   any, 
                p_Results: any, 
                p_Stats:   number)
    {
        this.#_Error   = p_Error;
        this.#_Results = p_Results;
        this.#_Stats   = p_Stats;

        Object.seal(this);
    }


    // Private holders
    #_Error:   any;
    #_Results: any;
    #_Stats:   number;


    // Public properties
    public get Error():   any { return this.#_Error}
    public get Results(): any { return this.#_Results}
    public get Stats():   any 
    { 
        if (0 === this.#_Stats)
            throw new CBException(CBExceptions.NoStatsGathered);

        return this.#_Stats;

    }


    // These are just to avoid typescript errors
    public get Count() {return 0;}
    [key:number]: FunctionResult | BaseStructResult;
    [Symbol.iterator]() 
    {
        return {
            next() 
            {
                return { value: undefined, done: true };
            }
        }
    }
}




class BaseStructResult
{
    constructor(p_CallsCount: number)
    {
        this.#_Count    = p_CallsCount;
        this.#_TsStart  = 0;
        this.#_TsFinish = 0;
    }



    // Private holders
    #_Count:    number;
    #_TsStart:  number;
    #_TsFinish: number;



    // Public properties
    public get Count(): number
    {
        return this.#_Count;
    }


    public get Error(): any
    {
        throw new Error("Use indexed properties to access error")
    }


    public get Results(): any
    {
        throw new Error("Use indexed properties to access results")
    }


    public get Stats(): any
    {
        if (0 === this.#_TsStart)
            throw new CBException(CBExceptions.NoStatsGathered);

        return this.#_TsFinish - this.#_TsStart;
    }


    public SetTsFinish?(p_Value: number)
    {
        if (p_Value > this.#_TsFinish)
            this.#_TsFinish = p_Value;
    }


    public SetTsStart?(p_Value: number)
    {
        if (this.#_TsStart === 0 || p_Value < this.#_TsStart)
            this.#_TsStart = p_Value;
    }


    [key:number]: FunctionResult | BaseStructResult;



    [Symbol.iterator]() 
    {
        let index = 0;
        const data = this;
        return {
            next() 
            {
                if (index < data.Count) 
                    return { value: data[index++], done: false };
                else 
                    return { done: true };
            }
        }
    }
}



export class ParallelResult   extends BaseStructResult {}


export class SequentialResult extends BaseStructResult {}




export class InternalResult 
{
    constructor(p_RootStruct:  RootStruct,
                p_Timeout:     number,
                p_StopOnError: boolean,
                p_GetStats:    boolean,
                p_onFinish:    Function)
    {
        this.#_CallsCount  = p_RootStruct.PlainCalls.filter( structCall => structCall.Type === CallTypes.Function).length;
        this.#_Count       = p_RootStruct.PlainCalls.length;
        this.#_GetStats    = p_GetStats;
        this.#_onFinish    = p_onFinish;
        this.#_RootStruct  = p_RootStruct;
        this.#_StopOnError = p_StopOnError;

        this.#_CallResults = new Array(this.#_Count).fill(false);

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
    #_AliasResult:  Record<string, FunctionResult | ParallelResult | SequentialResult> = {};
    #_Count:        number = 0;


    #_CallsCount:   number;
    #_CallResults:  Array<boolean>;
    #_Finished:     boolean = false;
    #_GetStats:     boolean;
    #_onFinish:     Function;
    #_ResultsCount: number = 0;
    #_RootStruct:   RootStruct;
    #_StopOnError:  boolean = false;
    #_TimeoutPtr:   NodeJS.Timeout;

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public properties
    // ----------------------------------------------------------------------------------------------------------------

    public get AliasResult(): Record<string, FunctionResult | ParallelResult | SequentialResult>
    {
        return this.#_AliasResult;
    }



    public get Count(): number
    {
        return this.#_Count;
    }



    public get Error(): boolean
    {
        return this.#_Error;
    }


    public get GetStats(): boolean
    {
        return this.#_GetStats;
    }


    public get Timeout(): boolean
    {
        return this.#_Timeout;
    }



    [key:number]: FunctionResult | BaseStructResult;


    // #endregion
    // ----------------------------------------------------------------------------------------------------------------






    // ----------------------------------------------------------------------------------------------------------------
    // #region Private methods
    // ----------------------------------------------------------------------------------------------------------------
    
    #_Finish(p_Exception?: Error,
             p_Timeout?:   boolean): void
    {
        if (! this.#_Finished)
        {
            if (p_Timeout)
                this.#_Timeout = true;

            clearTimeout(this.#_TimeoutPtr);
            this.#_TimeoutPtr?.unref()

            this.#_onFinish!(p_Exception);

            this.#_Finished = true;
        }
    }



    #_SetParentResult(p_CallStruct: CallsStruct | ExecStruct,
                      p_TsStart:    number,
                      p_TsFinish:   number): void
    {
        // Set parent results and errors
        if (p_CallStruct.Parent)
        {
            if (!this[p_CallStruct.Parent.RootIndex]) // 
            {
                if (p_CallStruct.Parent.Type === CallTypes.Parallel)
                    this[p_CallStruct.Parent.RootIndex] = new ParallelResult(p_CallStruct.Parent.Calls.length);
                else
                    this[p_CallStruct.Parent.RootIndex] = new SequentialResult(p_CallStruct.Parent.Calls.length);
            }


            // Check if needs to store stats info
            if (this.#_RootStruct.GetStats)
            {
                (<BaseStructResult>this[p_CallStruct.Parent.RootIndex]).SetTsStart!(p_TsStart);
                (<BaseStructResult>this[p_CallStruct.Parent.RootIndex]).SetTsFinish!(p_TsFinish);
            }



            // Check alias
            if (p_CallStruct.Parent.Alias !== "")
                this.#_AliasResult[p_CallStruct.Parent.Alias] = this[p_CallStruct.Parent.RootIndex];

            
            // Set value at parent position
            (<BaseStructResult>this[p_CallStruct.Parent.RootIndex])[p_CallStruct.ParentIndex] = this[p_CallStruct.RootIndex];


            // Check parent
            this.#_SetParentResult(p_CallStruct.Parent,
                                   p_TsStart,
                                   p_TsFinish);
        }
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public methods
    // ----------------------------------------------------------------------------------------------------------------

    public GetResult(): Result
    {
        return new Result(this);
    }



    public SetException(p_Index:     number, 
                         p_Alias:     string, 
                         p_Exception: Error)
    {
        (<CBException>p_Exception).details = `Call alias: "${p_Alias}"\nCall index: ${p_Index}`,

        this.#_Finish(p_Exception);
    }



    public SetResult(p_Index:    number, 
                     p_Alias:    string, 
                     p_Error:    any, 
                     p_TsStart:  number, 
                     p_TsFinish: number, 
                     p_Results:  any[] | null): void
    {
        // Check if result has already been set
        if (this.#_CallResults![p_Index])
        {
            this.SetException!(p_Index, p_Alias, new CBException(CBExceptions.ResultAlreadySet));
            return;
        }
        else
            this.#_CallResults![p_Index] = true;



        // Result
        const objResult: FunctionResult = new FunctionResult(p_Error, p_Results, (p_TsFinish - p_TsStart) );



        // Store result in dictionary
        if (p_Alias !== "")
            this.#_AliasResult[p_Alias] = objResult;



        // Indexed property
        this[p_Index] = objResult;



        // Set parent result
        const callStruct = this.#_RootStruct!.PlainCalls[p_Index]
        this.#_SetParentResult(callStruct, p_TsStart, p_TsFinish);



        // Check error
        if (p_Error)
        {
            this.#_Error = true;

            if (this.#_StopOnError)
                this.#_Finish();
        }



        // Increment # calls that returned
        this.#_ResultsCount!++;



        // If all calls returned, finish 
        if (this.#_ResultsCount! >= this.#_CallsCount!)
            this.#_Finish();
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------

}




export class Result 
{
    constructor(p_InternalResult: InternalResult)
    {
        this.#_AliasResult = p_InternalResult.AliasResult;
        this.#_Count       = p_InternalResult.Count;
        this.#_Error       = p_InternalResult.Error;
        this.#_Timeout     = p_InternalResult.Timeout;


        for (let intA = 0; intA < p_InternalResult.Count; intA++)
        {
            this[intA] = p_InternalResult[intA];
        }

        this.#_Stats = (p_InternalResult.GetStats ? this[0].Stats : -1);
    }




    // ----------------------------------------------------------------------------------------------------------------
    // #region Private fields
    // ----------------------------------------------------------------------------------------------------------------

    #_AliasResult:  Record<string, FunctionResult | ParallelResult | SequentialResult> = {};
    #_Count:        number  = 0;
    #_Error:        boolean = false;
    #_Stats:        number  = 0;
    #_Timeout:      boolean = false;

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public properties
    // ----------------------------------------------------------------------------------------------------------------

    public get Count(): number
    {
        return this.#_Count;
    }



    public get Error(): boolean
    {
        return this.#_Error;
    }


    public get Stats(): number
    {
        if (-1 === this.#_Stats)
            throw new CBException(CBExceptions.NoStatsGathered);

        return this[0].Stats;
    }



    public get Timeout(): boolean
    {
        return this.#_Timeout;
    }



    [key:number]: FunctionResult | BaseStructResult;



    [Symbol.iterator]() 
    {
        let index = 0;
        const data = this;
        return {
            next() 
            {
                if (index < data.Count) 
                    return { value: data[index++], done: false };
                else 
                    return { done: true };
            }
        }
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public methods
    // ----------------------------------------------------------------------------------------------------------------

    public ByAlias(p_Alias: string): FunctionResult | ParallelResult | SequentialResult
    {
        return this.#_AliasResult[p_Alias];
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------
}