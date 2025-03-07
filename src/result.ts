import { FunctionStruct, 
         CallTypes, 
         ExecStruct, 
         RootStruct }   from "./calls-struct";
import { CBException, 
         CBExceptions } from "./exceptions";





// --------------------------------------------------------------------------------------------------------------------
// #region Internal classes
// --------------------------------------------------------------------------------------------------------------------

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
        this.#_Stats       = new Array(this.#_Count).fill([-1, -1]);

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
    #_AliasResult:  Record<string, SequentialResult | ParallelResult | FunctionResult> = {};
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
    #_Stats:        Array<[number, number]>

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public properties
    // ----------------------------------------------------------------------------------------------------------------

    public get AliasResult(): Record<string, SequentialResult | ParallelResult | FunctionResult>
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



    [key:number]: SequentialResult | ParallelResult | FunctionResult;


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



    #_SetParentResult(p_CallStruct: FunctionStruct | ExecStruct,
                      p_TsStart:    number,
                      p_TsFinish:   number): void
    {
        // Set parent results and errors
        if (p_CallStruct.Parent)
        {
            // Retrieves array to store stats
            const arrStats: [number, number] = this.#_Stats[p_CallStruct.Parent.RootIndex];


            // Stores stats info
            if (this.#_RootStruct.GetStats)
            {
                if (arrStats[0] === -1 || p_TsStart < arrStats[0])
                    arrStats[0] = p_TsStart;
                if (p_TsFinish > arrStats[1])
                    arrStats[1] = p_TsFinish;
            }


            // Creates result object
            if (!this[p_CallStruct.Parent.RootIndex])
            {
                if (p_CallStruct.Parent.Type === CallTypes.Parallel)
                    this[p_CallStruct.Parent.RootIndex] = new ParallelResult(p_CallStruct.Parent.Calls.length, 
                                                                             this.#_RootStruct.GetStats,
                                                                             arrStats);
                else
                    this[p_CallStruct.Parent.RootIndex] = new SequentialResult(p_CallStruct.Parent.Calls.length, 
                                                                               this.#_RootStruct.GetStats,
                                                                               arrStats);
            }


            // Checks alias
            if (p_CallStruct.Parent.Alias !== "")
                this.#_AliasResult[p_CallStruct.Parent.Alias] = this[p_CallStruct.Parent.RootIndex];

            
            // Set value at parent position
            this[p_CallStruct.Parent.RootIndex][p_CallStruct.ParentIndex] = this[p_CallStruct.RootIndex];


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
        // Checks if result has already been set
        if (this.#_CallResults![p_Index])
        {
            this.SetException!(p_Index, p_Alias, new CBException(CBExceptions.ResultAlreadySet));
            return;
        }
        else
            this.#_CallResults![p_Index] = true;


        // Creates Result object
        const objResult: FunctionResult = new FunctionResult(p_Error, 
                                                             p_Results, 
                                                             (p_TsFinish - p_TsStart) );

        // Stores result in dictionary
        if (p_Alias !== "")
            this.#_AliasResult[p_Alias] = objResult;


        // Indexed property
        this[p_Index] = objResult;


        // Sets parent result
        const callStruct = this.#_RootStruct!.PlainCalls[p_Index]
        this.#_SetParentResult(callStruct, p_TsStart, p_TsFinish);


        // Checks error
        if (p_Error)
        {
            this.#_Error = true;

            if (this.#_StopOnError)
                this.#_Finish();
        }


        // Increments # calls that returned
        this.#_ResultsCount!++;


        // If all calls returned, finish 
        if (this.#_ResultsCount! >= this.#_CallsCount!)
            this.#_Finish();
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------

}

// #endregion
// --------------------------------------------------------------------------------------------------------------------





// --------------------------------------------------------------------------------------------------------------------
// #region Public classes
// --------------------------------------------------------------------------------------------------------------------

abstract class BaseResult
{
    constructor(p_Count:       number,
                p_Error?:      any,
                p_Results?:    any,
                p_Stats?:      number,
                p_StatsArray?: [number, number])
    {
        this.#_Length      = p_Count;
        this.#_Errors     = p_Error   ? p_Error   : null;
        this.#_Results    = p_Results ? p_Results : null;
        this.#_Stats      = p_Stats ? p_Stats : -1;
        this.#_StatsArray = p_StatsArray;
    }


    // Private holders
    #_Length:       number;
    #_Errors?:     any[];
    #_Results?:    any[];
    #_Stats:       number;
    #_StatsArray?: [number, number];


    public get length(): number
    {
        return this.#_Length;
    }


    public get error(): any
    {
        if (!this.#_Errors && this.#_Length > 0)
        {
            this.#_Errors = [];

            for(let intA = 0; intA < this.length; intA++)
            {
                this.#_Errors[intA] = this[intA].error;
            }
        }

        return this.#_Errors;
    }



    public get results(): any
    {
        if (!this.#_Results && this.#_Length > 0)
        {
            this.#_Results = [];

            for(let intA = 0; intA < this.length; intA++)
            {
                this.#_Results[intA] = this[intA].results;
            }
        }

        return this.#_Results;
    }
    

    
    public get stats(): number
    {
        // Gets stats
        if (-2 === this.#_Stats)
            this.#_Stats = this.#_StatsArray![1] - this.#_StatsArray![0];

        if (-1 === this.#_Stats)
            throw new CBException(CBExceptions.NoStatsGathered);

        return this.#_Stats;
    }


    [key:number]: BaseResult; 


    protected [Symbol.iterator](): any
    {
        let index = 0;
        const data = this;
        return {
            next() 
            {
                if (index < data.length) 
                    return { value: data[index++], done: false };
                else 
                    return { done: true };
            }
        }
    }
}

abstract class BaseStructResult extends BaseResult
{
    constructor(p_Count:      number,
                p_GetStats:   boolean,
                p_StatsArray: [number, number])
    {
        super(p_Count,
              null,
              null,
              p_GetStats ? -2 : -1,
              p_StatsArray
        );
    }
}




/**
 * Stores results from function structure execution.
 */
export class FunctionResult extends BaseResult
{
    constructor(p_Error:   any,
                p_Results: any,
                p_Stats:   number)
    {
        super(0, 
              p_Error, 
              p_Results, 
              p_Stats);
    }
}



/**
 * Stores results from parallel structure execution.
 */
export class ParallelResult extends BaseStructResult {}



/**
 * Stores results from sequential structure execution.
 */
export class SequentialResult extends BaseStructResult {}



/**
 * Stores results from all structures execution and flags if errors or timeout occured.
 */
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

        this.#_Stats = (p_InternalResult.GetStats ? this[0].stats : -1);


        Object.seal(this);
    }




    // ----------------------------------------------------------------------------------------------------------------
    // #region Private fields
    // ----------------------------------------------------------------------------------------------------------------

    #_AliasResult:  Record<string, SequentialResult | ParallelResult | FunctionResult> = {};
    #_Count:        number  = 0;
    #_Error:        boolean = false;
    #_Stats:        number  = 0;
    #_Timeout:      boolean = false;

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public properties
    // ----------------------------------------------------------------------------------------------------------------

    public get length(): number
    {
        return this.#_Count;
    }


    public get error(): boolean
    {
        return this.#_Error;
    }


    public get stats(): number
    {
        if (-1 === this.#_Stats)
            throw new CBException(CBExceptions.NoStatsGathered);

        return this[0].stats;
    }


    public get timeout(): boolean
    {
        return this.#_Timeout;
    }


    [key:number]: SequentialResult | ParallelResult | FunctionResult;


    protected [Symbol.iterator]() 
    {
        let index = 0;
        const data = this;
        return {
            next() 
            {
                if (index < data.length) 
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

    public getByAlias(p_Alias: string): SequentialResult | ParallelResult | FunctionResult
    {
        return this.#_AliasResult[p_Alias];
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------
}

// #endregion
// --------------------------------------------------------------------------------------------------------------------
