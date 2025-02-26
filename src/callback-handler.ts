import { CallTypes,
         BaseStruct,
         CallsStruct,
         ExecStruct,
         RootStruct}         from "./calls-struct";
import { Result }            from "./result";
import { CBException,
         CBExceptions }      from "./exceptions"



export const PREVIOUS_ERROR   = Symbol("PREVIOUS_ERROR");
export const PREVIOUS_RESULT1 = Symbol("PREVIOUS_RESULT1");
export const PREVIOUS_RESULT2 = Symbol("PREVIOUS_RESULT2");
export const PREVIOUS_RESULT3 = Symbol("PREVIOUS_RESULT3");
export const PREVIOUS_RESULT4 = Symbol("PREVIOUS_RESULT4");
export const PREVIOUS_RESULT5 = Symbol("PREVIOUS_RESULT5");
export const PREVIOUS_RESULT6 = Symbol("PREVIOUS_RESULT6");
export const PREVIOUS_RESULT7 = Symbol("PREVIOUS_RESULT7");
export const PREVIOUS_RESULT8 = Symbol("PREVIOUS_RESULT8");
export const PREVIOUS_RESULT9 = Symbol("PREVIOUS_RESULT9");


export abstract class CB
{

    public static f(p_Alias:   string,   
                    p_Fn:      Function, 
                    ...p_Args: any): CallsStruct;
    public static f(p_Fn:      Function, 
                    ...p_Args: any): CallsStruct;
    public static f(p_Param1:  string | Function, 
                    p_Param2:   any, 
                    ...p_Args:  any): CallsStruct
    {

        let strAlias: string;
        let fnCall:   Function;
        let arrArgs:  Array<any>;
    
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
            ParentIndex: -1
        }
    }




    public static p(...p_Fns: Array<CallsStruct | ExecStruct>): ExecStruct;
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
            Errors:      [],
            Results:     [],
              
            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,

            ParentIndex: -1,
            RootIndex:   -1,
        }

        // Set parent
        for (let structCall of structParallel.Calls)
        {
            structCall.Parent = structParallel;
        }


        return structParallel;
    }




    public static s(...p_Fns: Array<CallsStruct | ExecStruct >): ExecStruct;
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
            Errors:      [],
            Results:     [],
              
            Parent:      null,
            Next:        null,
            Previous:    null,
            Root:        null,
  
            ParentIndex: -1,
            RootIndex:   -1,
        }


        // Set parent, previous, next
        for (let intA = 0; intA < structSequential.Calls.length; intA++)
        {
            const structCall: CallsStruct = <CallsStruct><unknown>structSequential.Calls[intA];

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




    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number): Promise<Result>;
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean): Promise<Result>;
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean): Promise<Result>;
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_Callback:      (p_Result: Result) => void): void;
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Callback:      (p_Result: Result) => void): void;
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean,
                    p_Callback:      (p_Result: Result) => void): void
    public static r(p_CallStruct:    ExecStruct, 
                    p_Timeout:       number,
                    p_Param3?:       boolean | Function,
                    p_Param4?:       boolean | Function,
                    p_Param5?:       (p_Result: Result) => void): void | Promise<Result>
    {
        try
        {
            //---------------------------------------------------------------------------------------------------------
            // #region Params
            //---------------------------------------------------------------------------------------------------------
            
            // Check params
            if (<unknown>p_CallStruct.Type !== CallTypes.Parallel &&
                <unknown>p_CallStruct.Type !== CallTypes.Sequential)
                throw new Error("Structure of calls must be of parallel or sequential types");
            if (p_Timeout < 0)
                p_Timeout = 5000;



            // Get overloaded params
            let fnCallback:      Function | undefined,
                blnBreakOnError: boolean,
                blnStats:        boolean;
            
            if ("function" === typeof p_Param3)
            {
                fnCallback = p_Param3;

                // Default values
                blnBreakOnError = true;
                blnStats        = false;
            }
            else if ("function" === typeof p_Param4)
            {
                fnCallback      = p_Param4;
                blnBreakOnError = p_Param3 || true;
                
                // Default value
                blnStats = false;
            }
            else if ("function" === typeof p_Param5)
            {
                fnCallback      = p_Param5;
                blnBreakOnError = p_Param3 || true;
                blnStats        = p_Param4 || false;
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


                    // Resolve
                    if (!p_Exception)
                        resolve(structRoot.MainResult);


                    // Reject
                    else
                    {
                        if (!(p_Exception instanceof CBException))
                            p_Exception = new CBException(CBExceptions.InternalError, <Error>p_Exception);

                        reject(p_Exception);
                    }
                }


                // Main result object
                structRoot.MainResult = new Result(structRoot,
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
                prmsReturn.then( value => fnCallback(null, value) );
        
        }

        catch (p_Exception)
        {
            if (p_Exception instanceof CBException)
                throw p_Exception
            else
                throw new CBException(CBExceptions.InternalError, <Error>p_Exception);
        }
    }



    static #Invoke(p_Call: CallsStruct | ExecStruct ): void
    {
        const objRoot:   RootStruct = (<RootStruct><unknown>p_Call.Root);
        const objResult: Result     = (<RootStruct><unknown>p_Call.Root).MainResult;

7        
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


            // No error, store results ....
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



        if (p_Call.Parent)
            p_Call.ParentIndex = ++p_Call.Parent.CallCount;


        switch (p_Call.Type)
        {
            case CallTypes.Function:
                setImmediate( () => 
                {
                    try
                    {
                        // Check args for tokens
                        if (p_Call.Parent!.Type === CallTypes.Sequential)
                        {

                        }

                        p_Call.Fn(...p_Call.Args, fnCallback);
                    }
                    catch (p_Exception)
                    {
                        p_Call.Exception = new CBException(CBExceptions.ExecutionException, <Error>p_Exception);
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
}
