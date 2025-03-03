import { CallTypes,
         CallsStruct,
         ExecStruct,
         RootStruct }    from "./calls-struct";
import { InternalResult,
         Result }        from "./result";
import { CBException,
         CBExceptions }  from "./exceptions"





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
                    ...p_Args: any[]): CallsStruct;
    public static f(p_Fn:      Function, 
                    ...p_Args: any[]): CallsStruct;
    public static f(p_Param1:  string | Function, 
                    p_Param2:   any, 
                    ...p_Args:  any[]): CallsStruct
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
            
            Invoked:     false,
            Error:       null,
            Results:     null,
            
            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,

            RootIndex:   -1,
            ParentIndex: -1,

            UseToken:    blnToken
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
    public static p(...p_Fns: Array<CallsStruct | ExecStruct>): ExecStruct;
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
                    ...p_Fns: Array<CallsStruct | ExecStruct>): ExecStruct;
    public static p(p_Param1: string | CallsStruct | ExecStruct, 
                    ...p_Fns: Array<CallsStruct | ExecStruct>): ExecStruct
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
            CallCount:   0,
              
            Invoked:     false,
            Error:       false,
            Errors:      [],
            Results:     [],
              
            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,

            ParentIndex: -1,
            RootIndex:   -1,
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
                    p_Callback:      (p_Error: any, p_Result: Result) => void): void;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Callback:      (p_Error: any, p_Result: Result) => void): void;
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean,
                    p_Callback:      (p_Error: any, p_Result: Result) => void): void
    public static e(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_Param3?:       boolean | Function,
                    p_Param4?:       boolean | Function,
                    p_Param5?:       (p_Error: any, p_Result: Result) => void): void | Promise<Result>
    {
        try
        {
            //---------------------------------------------------------------------------------------------------------
            // #region Params
            //---------------------------------------------------------------------------------------------------------
            
            // Check params
            if (<unknown>p_CallStruct.Type !== CallTypes.Parallel &&
                <unknown>p_CallStruct.Type !== CallTypes.Sequential)
                throw new CBException(CBExceptions.InvalidStructToExecute);
            if (p_Timeout < 0)
                p_Timeout = 5000;



            // Get overloaded params
            let fnCallback:      Function | undefined,
                blnBreakOnError: boolean = true,   // 🠄 default value
                blnStats:        boolean = false;  // 🠄 default value


            if ("function" === typeof p_Param3)
            {
                fnCallback = p_Param3;
            }
            else if ("boolean" === typeof p_Param3)
            {
                blnBreakOnError = p_Param3;


                if ("function" === typeof p_Param4)
                {
                    fnCallback = p_Param4;
                }
                else if ("boolean" === typeof p_Param4)
                {
                    blnStats = p_Param4;


                    if ("function" === typeof p_Param5)
                    {
                        fnCallback = p_Param5;
                    }
                }
            }

            // #endregion
            //---------------------------------------------------------------------------------------------------------





            //---------------------------------------------------------------------------------------------------------
            // #region Root element
            //---------------------------------------------------------------------------------------------------------

            // Root values
            const structRoot: RootStruct = (<RootStruct><unknown>p_CallStruct);
            let   intCalls:   number = -1;
            structRoot.PlainCalls = [];


            // Function to set root 
            const fnSetRoot: Function = function(p_Root:               ExecStruct,
                                                 p_CallStructSetRoot?: CallsStruct | ExecStruct ): void
            {
                // If second parameter is absent, we are in root element
                if (!p_CallStructSetRoot)
                    p_CallStructSetRoot = p_Root;


                // Set root in element
                p_CallStructSetRoot.Root = p_Root;


                // Store in plain calls
                structRoot.PlainCalls.push(p_CallStructSetRoot);


                // Set call position in main call struct
                (<CallsStruct><unknown>p_CallStructSetRoot).RootIndex = ++intCalls;


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
                                                           onFinish);

                // Initiate calls
                CB.#Invoke(p_CallStruct);
            });





            // No callback function provided -> return Promise ...
            if (!fnCallback)
                return prmsReturn;

            // ... invoke callback function
            else
                prmsReturn
                .then( value => fnCallback(undefined, value) )
                .catch( error => fnCallback(error));
        }

        catch (p_Exception)
        {
            if (p_Exception instanceof CBException)
                throw p_Exception
            else
                throw new CBException(CBExceptions.InternalError, <Error>p_Exception);
        }
    }




    /**
     * Creates a struct of functions to be executed in sequence
     * @param p_Fns Functions structs to be executed in sequence
     * 
     *              Create a function struct with {@link CB.f}
     */
    public static s(...p_Fns: Array<CallsStruct | ExecStruct >): ExecStruct;
    /**
     * Creates a struct of functions to be executed in sequence
     * @param p_Alias A unique name to retrieve results of this struct
     * @param {...(CallsStruct | ExecStruct)} p_Fns One or more function structs to be executed in sequence
     * 
     *              Create a function struct with {@link CB.f}
     */
    public static s(p_Alias:  string, 
                    ...p_Fns: Array<CallsStruct | ExecStruct >): ExecStruct;
    public static s(p_Param1: string | CallsStruct | ExecStruct, 
                    ...p_Fns: Array<CallsStruct | ExecStruct >): ExecStruct
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
  
            Calls:       arrStructs,
            CallCount:   0,
              
            Invoked:     false,
            Error:       false,
            Errors:      [],
            Results:     [],
              
            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,
  
            ParentIndex: -1,
            RootIndex:   -1,
        }


        // Set parent, previous, next and check tokens validity
        for (let intA = 0; intA < structSequential.Calls.length; intA++)
        {
            const structCall: CallsStruct = <CallsStruct><unknown>structSequential.Calls[intA];


            // Check tokens in first function
            if (intA === 0 && structCall.UseToken)
                throw new CBException(CBExceptions.TokenInFirstCall);
            

            // Parent
            structCall.Parent = structSequential;


            // Previous and next
            if (intA < structSequential.Calls.length - 1)
                structCall.Next = <CallsStruct><unknown>structSequential.Calls[intA + 1];
            if (intA > 0)
                structCall.Previous = <CallsStruct><unknown>structSequential.Calls[intA - 1];
        }


        return structSequential;
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------





    // ----------------------------------------------------------------------------------------------------------------
    // #region Private methods
    // ----------------------------------------------------------------------------------------------------------------

    static #Invoke(p_Call: CallsStruct | ExecStruct ): void
    {
        const objRoot:   RootStruct     = (<RootStruct><unknown>p_Call.Root);
        const objResult: InternalResult = (<RootStruct><unknown>p_Call.Root).MainResult;


        
        // Ignore if execution was broken
        if (objRoot.Break)
            return;



        // Callback function
        const fnCallback: Function = function()
        {
            // Ignore if execution was broken
            if (objRoot.Break)
                return;


            // Unboxing
            const structCallCallback: CallsStruct = <CallsStruct>p_Call;


            // No error, store results ...
            if (!structCallCallback.Exception)
            {
                structCallCallback.Invoked = true;
                structCallCallback.Error   = arguments[0];
                structCallCallback.Results = Array.prototype.slice.call(arguments, 1);

                objResult.SetResult!( structCallCallback.RootIndex, 
                                      structCallCallback.Alias, 
                                      structCallCallback.Error, 
                                      0, 
                                      structCallCallback.Results);

                // Invoke next call in sequence struct
                if (p_Call.Next)
                    CB.#Invoke(p_Call.Next);
            }

            // ... some error ➔ stop execution
            else
            {
                objResult.SetException!( (<CallsStruct>p_Call).RootIndex, 
                                          p_Call.Alias,     
                                          p_Call.Exception);
            }
        }



        // Set position in parent structure
        if (p_Call.Parent)
            p_Call.ParentIndex = p_Call.Parent.CallCount++;



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
                            let intResult: number = -1;


                            // Substitute token for previous result
                            for (let intA = 0; intA < p_Call.Args.length; intA++)
                            {
                                const varArg: any = p_Call.Args[intA];

                                if ("symbol" === typeof varArg)
                                {
                                    switch (varArg)
                                    {
                                        // Error
                                        case CB.PREVIOUS_ERROR:
                                            p_Call.Args[intA] = p_Call.Previous!.Error;
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


                                    // Substitute result
                                    if (intResult > -1)
                                    {
                                        // Check if result exists
                                        if ("undefined" === typeof p_Call.Previous!.Results![intResult])
                                            throw new CBException(CBExceptions.InvalidTokenResult);
                                        
                                        // Change arg value
                                        p_Call.Args[intA] = p_Call.Previous!.Results![intResult];
                                    }
                                }
                            }
                        }


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
                p_Call.Invoked = true;
                break;



            case CallTypes.Sequential:
                CB.#Invoke(p_Call.Calls[0]);
                p_Call.Invoked = true;
                break;
        }
    }

    // #endregion
    // ----------------------------------------------------------------------------------------------------------------
}