import { CallTypes,
         FunctionStruct,
         ExecStruct,
         RootStruct }       from "./calls-struct";
import { FunctionResult,
         InternalResult,
         ParallelResult,
         Result, 
         SequentialResult } from "./result";
import { CBException,
         CBExceptions }     from "./exceptions"





export abstract class CB
{
    // ----------------------------------------------------------------------------------------------------------------
    // #region Tokens
    // ----------------------------------------------------------------------------------------------------------------

    public static readonly PREVIOUS_ERROR   = Symbol("PREVIOUS_ERROR");
    public static readonly PREVIOUS_RESULT1 = Symbol("PREVIOUS_RESULT1");
    public static readonly PREVIOUS_RESULT2 = Symbol("PREVIOUS_RESULT2");
    public static readonly PREVIOUS_RESULT3 = Symbol("PREVIOUS_RESULT3");
    public static readonly PREVIOUS_RESULT4 = Symbol("PREVIOUS_RESULT4");
    public static readonly PREVIOUS_RESULT5 = Symbol("PREVIOUS_RESULT5");
    public static readonly PREVIOUS_RESULT6 = Symbol("PREVIOUS_RESULT6");
    public static readonly PREVIOUS_RESULT7 = Symbol("PREVIOUS_RESULT7");
    public static readonly PREVIOUS_RESULT8 = Symbol("PREVIOUS_RESULT8");
    public static readonly PREVIOUS_RESULT9 = Symbol("PREVIOUS_RESULT9");


    static #_Tokens: Symbol[] = 
    [
        CB.PREVIOUS_ERROR,
        CB.PREVIOUS_RESULT1,
        CB.PREVIOUS_RESULT2,
        CB.PREVIOUS_RESULT3,
        CB.PREVIOUS_RESULT4,
        CB.PREVIOUS_RESULT5,
        CB.PREVIOUS_RESULT6,
        CB.PREVIOUS_RESULT7,
        CB.PREVIOUS_RESULT8,
        CB.PREVIOUS_RESULT9,
    ]

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Public methods
    // ----------------------------------------------------------------------------------------------------------------


    public static f(p_Alias:   string,   
                    p_Fn:      Function, 
                    ...p_Args: any[]): FunctionStruct;
    public static f(p_Fn:      Function, 
                    ...p_Args: any[]): FunctionStruct;
    public static f(p_Param1:  string | Function, 
                    p_Param2:   any, 
                    ...p_Args:  any[]): FunctionStruct
    {

        let strAlias: string;
        let fnCall:   Function;
        let arrArgs:  Array<any>;
        let blnToken: boolean = false;
    

        if ("string" === typeof p_Param1)
        {
            strAlias = p_Param1;
            fnCall   = p_Param2;
            arrArgs  = [ ...p_Args ];
        }
        else
        {
            strAlias = ""
            fnCall   = p_Param1;
            arrArgs  = [ p_Param2, ...p_Args ];
        }


        // Check for tokens
        if (
            p_Args.length > 0 &&
            p_Args.some(varArg => CB.#_Tokens.includes(varArg)))
        {
            blnToken = true;
        }
        
        
        return {
            Type:        CallTypes.Function,
            Alias:       strAlias,
            
            Fn:          fnCall,
            Args:        arrArgs,
            
            Finished:    false,
            Invoked:     false,

            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,

            RootIndex:   -1,
            ParentIndex: -1,

            UseToken:    blnToken,

            TsStart:     0,
            TsFinish:    0
        }
    }





    /**
     * Creates a struct of functions to be executed in parallel
     * ```js
     * const structParallel = CB.p (
     *   CB.f (fn1, arg1),   // 🠄 Function struct
     *   CB.f (fn2, arg2),   // 🠄 Function struct
     *   CB.s (              // 🠄 Sequential struct
     *     CB.f (fn3, arg3), //   🠄 Function struct
     *     CB.f (fn4, arg4)  //   🠄 Function struct
     * ));
     * ```
     * Create a function struct with {@link CB.f}
     * 
     * `fn1` and `fn2` will be executed in parallel.
     * 
     * `fn3` and `fn4` will be executed in sequence.
     * 
     * The sequential structure (`fn3`, `fn4`) will be executed in parallel with the previous `fn1` and `fn2`.
     * 
     * @param p_Fns Functions structs to be executed in parallel
     * @returns A struct {@link ExecStruct} representing functions to be executed in parallel
     */
    public static p(...p_Fns: Array<FunctionStruct | ExecStruct>): ExecStruct;
    /**
     * Creates a struct of functions to be executed in parallel
     * ```js
     * const structParallel = CB.p (
     *   CB.f (fn1, arg1),   // 🠄 Function struct
     *   CB.f (fn2, arg2),   // 🠄 Function struct
     *   CB.s (              // 🠄 Sequential struct
     *     CB.f (fn3, arg3), //   🠄 Function struct
     *     CB.f (fn4, arg4)  //   🠄 Function struct
     * ));
     * ```
     * Create a function struct with {@link CB.f}
     * @param {string} p_Alias A unique name to retrieve results of this struct
     * @param p_Fns Functions structs to be executed in parallel. 
     * @returns A struct ({@link ExecStruct}) representing functions to be executed in parallel
     */
    public static p(p_Alias:  string, 
                    ...p_Fns: Array<FunctionStruct | ExecStruct>): ExecStruct;
    public static p(p_Param1: string | FunctionStruct | ExecStruct, 
                    ...p_Fns: Array<FunctionStruct | ExecStruct>): ExecStruct
    {
        let strAlias:   string;
        let arrStructs: Array<any>;
    
        if ("string" === typeof p_Param1)
        {
            strAlias   = p_Param1;
            arrStructs = [ ...p_Fns ];
        }
        else
        {
            strAlias   = ""
            arrStructs = [ p_Param1, ...p_Fns ];
        }


        const structParallel: ExecStruct = 
        {
            Alias:       strAlias,
            Type:        CallTypes.Parallel,
  
            Calls:       arrStructs,
            CallQty:     0,
            CallCount:   0,
              
            Finished:    false,
            Invoked:     false,

            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,

            ParentIndex: -1,
            RootIndex:   -1,

            TsStart:     0,
            TsFinish:    0
        }


        // Set parent and check tokens validity
        for (let structCall of structParallel.Calls)
        {
            // Set parent
            structCall.Parent = structParallel;


            // Check tokens in first function
            if (structCall.UseToken)
                throw new CBException(CBExceptions.TokenInParallelCall);
        }


        return structParallel;
    }





    /**
     * Executes a parallel or sequential struct of functions with callbacks
     * @param p_CallStruct Struct with functions to be executed.
     *                     Create a struct with {@link CB.p} (for parallel functions) or {@link CB.s} (for sequential functions).
     * @param p_Timeout Maximum time (in milliseconds) for execution to complete
     */
    public static e(p_CallStruct:    ExecStruct): Promise<Result>;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number): Promise<Result>;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean): Promise<Result>;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean): Promise<Result>;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_Callback:      (p_Error: boolean | Error, p_Timeout: boolean, p_Result: Result) => void): void;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_Callback:      (p_Error: boolean | Error, p_Timeout: boolean, p_Result: Result) => void): void;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Callback:      (p_Error: boolean | Error, p_Timeout: boolean, p_Result: Result) => void): void;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean,
                    p_Callback:      (p_Error: boolean | Error, p_Timeout: boolean, p_Result: Result) => void): void
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number = 5000,
                    p_Param3?:       boolean | Function,
                    p_Param4?:       boolean | Function,
                    p_Param5?:       (p_Error: boolean | Error, p_Timeout: boolean, p_Result: Result) => void): void | Promise<Result>
    {
        let fnCallback:      Function | undefined,
            blnBreakOnError: boolean = true,   // 🠄 default value
            blnStats:        boolean = false;  // 🠄 default value



        try
        {
            //---------------------------------------------------------------------------------------------------------
            // #region Params
            //---------------------------------------------------------------------------------------------------------
            
            // Default timeout
            if (p_Timeout <= 0)
                p_Timeout = 5000;


            // Overloaded params
            if ("function" === typeof p_Param3)
                fnCallback = p_Param3;

            else if ("boolean" === typeof p_Param3)
            {
                blnBreakOnError = p_Param3;


                if ("function" === typeof p_Param4)
                    fnCallback = p_Param4;

                else if ("boolean" === typeof p_Param4)
                {
                    blnStats = p_Param4;

                    if ("function" === typeof p_Param5)
                        fnCallback = p_Param5;
                }
            }


            // Check params
            if (<unknown>p_CallStruct.Type !== CallTypes.Parallel &&
                <unknown>p_CallStruct.Type !== CallTypes.Sequential)
                throw new CBException(CBExceptions.InvalidStructToExecute);

            // #endregion
            //---------------------------------------------------------------------------------------------------------





            //---------------------------------------------------------------------------------------------------------
            // #region Root element
            //---------------------------------------------------------------------------------------------------------

            // Root values
            const structRoot: RootStruct = (<RootStruct><unknown>p_CallStruct);
            let   intCalls:   number = -1;

            structRoot.PlainCalls = [];
            structRoot.GetStats   = blnStats;


            // Function to set root 
            const fnSetRoot: Function = function(p_Root:               ExecStruct,
                                                 p_CallStructSetRoot?: FunctionStruct | ExecStruct ): void
            {
                // If second parameter is absent, we are in root element
                if (!p_CallStructSetRoot)
                    p_CallStructSetRoot = p_Root;


                // Store in plain calls
                structRoot.PlainCalls.push(p_CallStructSetRoot);


                // Set call position in main call struct
                (<FunctionStruct><unknown>p_CallStructSetRoot).RootIndex = ++intCalls;


                // Set root in element
                p_CallStructSetRoot.Root = p_Root;


                // Set root in children
                if (p_CallStructSetRoot.Type === CallTypes.Parallel || 
                    p_CallStructSetRoot.Type === CallTypes.Sequential)
                {
                    for (let structCallSetRoot of p_CallStructSetRoot.Calls)
                    {
                        fnSetRoot(p_Root, structCallSetRoot);
                    }
                }
            };


            // Set root in children
            fnSetRoot( p_CallStruct)

            // #endregion
            //---------------------------------------------------------------------------------------------------------





            // Promise to handle results
            const prmsReturn: Promise<Result> = new Promise( (resolve, reject) =>
            {
                // onFinish function passed to Result instance
                const onFinish: Function = (p_Exception?: Error) =>
                { 
                    // Break current execution     
                    structRoot.Break = true;


                    // Reject
                    if (p_Exception)
                    {
                        // Assert exception is instance of CBException
                        if (!(p_Exception instanceof CBException))
                            p_Exception = new CBException(CBExceptions.InternalError, <Error>p_Exception);

                        reject(p_Exception);
                    }


                    // Resolve
                    else
                        resolve(structRoot.MainResult.GetResult());
                }


                // Main result object
                structRoot.MainResult = new InternalResult(structRoot,
                                                           p_Timeout,
                                                           blnBreakOnError,
                                                           blnStats,
                                                           onFinish);

                // Initiate calls
                CB.#Invoke(p_CallStruct);
            });




            // No callback function provided ➔ return Promise ...
            if (!fnCallback)
                return prmsReturn;

            // ... invoke callback function
            else
                prmsReturn
                .then( value  => fnCallback!(value.error, value.timeout, value) )
                .catch( error => fnCallback!(error) );
        }

        catch (p_Exception)
        {
            const excptUnknow: CBException = p_Exception instanceof CBException ?
                                                 p_Exception :
                                                 new CBException(CBExceptions.InternalError, <Error>p_Exception);

            if (!fnCallback)
                throw excptUnknow;
            else
                fnCallback(excptUnknow);
        }
    }




    /**
     * Creates a struct of functions to be executed in sequence
     * @param p_Fns Functions structs to be executed in sequence
     * 
     *              Create a function struct with {@link CB.f}
     */
    public static s(...p_Fns: Array<FunctionStruct | ExecStruct >): ExecStruct;
    /**
     * Creates a struct of functions to be executed in sequence
     * @param p_Alias A unique name to retrieve results of this struct
     * @param {...(FunctionStruct | ExecStruct)} p_Fns One or more function structs to be executed in sequence
     * 
     *              Create a function struct with {@link CB.f}
     */
    public static s(p_Alias:  string, 
                    ...p_Fns: Array<FunctionStruct | ExecStruct >): ExecStruct;
    public static s(p_Param1: string | FunctionStruct | ExecStruct, 
                    ...p_Fns: Array<FunctionStruct | ExecStruct >): ExecStruct
    {
        let strAlias:   string;
        let arrStructs: Array<any>;
    
        if ("string" === typeof p_Param1)
        {
            strAlias   = p_Param1;
            arrStructs = [ ...p_Fns ];
        }
        else
        {
            strAlias   = ""
            arrStructs = [ p_Param1, ...p_Fns ];
        }


        const structSequential: ExecStruct = 
        {
            Alias:       strAlias,
            Type:        CallTypes.Sequential,
  
            CallCount:   0,
            CallQty:     0,
            Calls:       arrStructs,
            
            Finished:    false,
            Invoked:     false,

            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,
  
            ParentIndex: -1,
            RootIndex:   -1,

            TsStart:     0,
            TsFinish:    0
        }


        // Set parent, previous, next and check tokens validity
        for (let intA = 0; intA < structSequential.Calls.length; intA++)
        {
            const structCall: FunctionStruct = <FunctionStruct><unknown>structSequential.Calls[intA];


            // Check tokens in first function
            if (intA === 0 && structCall.UseToken)
                throw new CBException(CBExceptions.TokenInFirstCall);
           

            // Parent
            structCall.Parent = structSequential;


            // Previous and next
            if (intA < structSequential.Calls.length - 1)
                structCall.Next = <FunctionStruct><unknown>structSequential.Calls[intA + 1];
            if (intA > 0)
                structCall.Previous = <FunctionStruct><unknown>structSequential.Calls[intA - 1];
        }


        return structSequential;
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Private methods
    // ----------------------------------------------------------------------------------------------------------------

    static #Invoke(p_Call: FunctionStruct | ExecStruct ): void
    {
        const objRoot:   RootStruct     = (<RootStruct><unknown>p_Call.Root);
        const objResult: InternalResult = (<RootStruct><unknown>p_Call.Root).MainResult;


        
        // Ignore if execution was broken
        if (objRoot.Break)
            return;


        // Check if we're getting stats info
        if (objRoot.GetStats)
            p_Call.TsStart = Date.now();


        // Set position in parent structure
        if (p_Call.Parent)
            p_Call.ParentIndex = p_Call.Parent.CallQty++;


        // ------------------------------------------------------------------------------------------------------------
        // #region Callback function
        // ------------------------------------------------------------------------------------------------------------

        const fnCallback: Function = function()
        {
            // Ignores if execution was broken
            if (objRoot.Break)
                return;


            // Checks if we're getting stats info
            if (objRoot.GetStats)
                p_Call.TsFinish = Date.now();


            // Unboxing (callback is used only for functions structures)
            const structCallCallback: FunctionStruct = <FunctionStruct>p_Call;


            // No error ➔ store results ...
            if (!structCallCallback.Exception)
                objResult.SetResult( structCallCallback.RootIndex, 
                                     structCallCallback.Alias, 
                                     arguments[0],
                                     structCallCallback.TsStart, 
                                     structCallCallback.TsFinish,
                                     Array.prototype.slice.call(arguments, 1));


            // ... some error ➔ stop execution
            else
                objResult.SetException( p_Call.RootIndex, 
                                        p_Call.Alias,     
                                        p_Call.Exception);


            // Mark as finished and increment parent's results
            const fnFinishCall: Function = (p_FinishCall: FunctionStruct | ExecStruct) =>
            {
                p_FinishCall.Finished = true;

                if (p_FinishCall.Parent)
                {
                    p_FinishCall.Parent.CallCount++;

                    if (p_FinishCall.Parent.CallCount === p_FinishCall.Parent.Calls.length)
                        fnFinishCall(p_FinishCall.Parent)
                }
            }
            fnFinishCall(p_Call);


            // Invoke next call in sequence struct
            if (p_Call.Next)
                CB.#Invoke(p_Call.Next);


            // Invoke next token in parent
            else if (p_Call.Parent!.Next && p_Call.Parent!.Finished)
                CB.#Invoke(p_Call.Parent!.Next);
        }

        // #endregion
        // ------------------------------------------------------------------------------------------------------------


        // ------------------------------------------------------------------------------------------------------------
        // #region Invokes
        // ------------------------------------------------------------------------------------------------------------

        switch (p_Call.Type)
        {
            case CallTypes.Function:
                setImmediate( () => 
                {
                    try
                    {
                        // Check args for tokens
                        if (p_Call.Parent!.Type === CallTypes.Sequential &&
                            p_Call.UseToken)
                        {
                            // Substitute token for previous result
                            for (let intA = 0; intA < p_Call.Args.length; intA++)
                            {
                                const varArg:  any     = p_Call.Args[intA];
                                let intResult: number  = -1,
                                    blnError:  boolean = false;


                                if ("symbol" === typeof varArg)
                                {
                                    switch (varArg)
                                    {
                                        // Error
                                        case CB.PREVIOUS_ERROR:
                                            blnError = true;
                                            break;


                                        // Results
                                        case CB.PREVIOUS_RESULT1: 
                                            intResult = 0;
                                            break;

                                        case CB.PREVIOUS_RESULT2: 
                                            intResult = 1;
                                            break;

                                        case CB.PREVIOUS_RESULT3: 
                                            intResult = 2;
                                            break;

                                        case CB.PREVIOUS_RESULT4: 
                                            intResult = 3;
                                            break;

                                        case CB.PREVIOUS_RESULT5: 
                                            intResult = 4;
                                            break;

                                        case CB.PREVIOUS_RESULT6: 
                                            intResult = 5;
                                            break;

                                        case CB.PREVIOUS_RESULT7: 
                                            intResult = 6;
                                            break;

                                        case CB.PREVIOUS_RESULT8: 
                                            intResult = 7;
                                            break;

                                        case CB.PREVIOUS_RESULT9: 
                                            intResult = 8;
                                            break;
                                    }


                                    // Previous error
                                    if (blnError)
                                        p_Call.Args[intA] = objResult[p_Call.Previous!.RootIndex].error;


                                    // Previous result
                                    else if (intResult > -1)
                                    {
                                        if (p_Call.Previous!.Type === CallTypes.Function)
                                        {
                                            // Check if result exists
                                            if ("undefined" === typeof objResult[p_Call.Previous!.RootIndex].results[intResult])
                                                throw new CBException(CBExceptions.InvalidTokenResult);
                                            
                                            // Change arg value
                                            p_Call.Args[intA] = objResult[p_Call.Previous!.RootIndex].results[intResult];
                                        }

                                        else
                                        {
                                            // Create array with results in all children, in all levels
                                            const arrPreviousResults: any[] = objResult[p_Call.Previous!.RootIndex].results;
                                            const arrFilteredResults: any[] = [];
                                            const fnGetResults:       Function = (p_Results:         any[], 
                                                                                  p_ResultsFiltered: any[], 
                                                                                  p_Struct:          FunctionResult | ParallelResult | SequentialResult) =>
                                            {
                                                for (let intA = 0; intA < p_Struct.length; intA++)
                                                {
                                                    // Check if result exists
                                                    if ( ! Array.isArray(p_Results[intA]) ||
                                                         p_Results[intA].length < (intResult + 1) )
                                                        return new CBException(CBExceptions.InvalidTokenResult);


                                                    // Gets the required result from function execution (leaf)
                                                    if (p_Struct[intA] instanceof FunctionResult)
                                                        p_ResultsFiltered[intA] = p_Results[intA][intResult];


                                                    // Gets the required result from parallel or sequential execution (node)
                                                    else
                                                    {
                                                        p_ResultsFiltered[intA] = [];

                                                        return fnGetResults(p_Results[intA],
                                                                            p_ResultsFiltered[intA],
                                                                            p_Struct[intA]);
                                                    }
                                                }
                                            }


                                            // Get results and check if result requested is valid
                                            const errGetResultsReturn: Error | undefined = fnGetResults(arrPreviousResults, 
                                                                                                        arrFilteredResults, 
                                                                                                        objResult[p_Call.Previous!.RootIndex]);
                                            if (errGetResultsReturn)
                                                throw errGetResultsReturn;


                                            // Change arg value
                                            p_Call.Args[intA] = arrFilteredResults;
                                        }
                                    }
                                }
                            }
                        }


                        // Execute function
                        p_Call.Fn(...p_Call.Args, fnCallback);
                    }
                    catch (p_Exception)
                    {
                        p_Call.Exception = p_Exception;
                        fnCallback();
                    }
                });

                break;



            case CallTypes.Parallel:
                for (let call of p_Call.Calls)
                {
                    CB.#Invoke(call);
                }
                break;



            case CallTypes.Sequential:
                CB.#Invoke(p_Call.Calls[0]);
                break;
        }

        // #endregion
        // ------------------------------------------------------------------------------------------------------------


        // Set invoked
        p_Call.Invoked = true;
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------
}