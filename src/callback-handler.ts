import { CallTypes,
         BaseStruct,
         CallsStruct,
         ParallelStruct,
         RootStruct,
         SequentialStruct }  from "./calls-struct";
import { Result }            from "./result";


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
            Type:      CallTypes.Function,
            Alias:     strAlias,
            
            Fn:        fnCall,
            Args:      arrArgs,
            
            Invoked:   false,
            Error:     null,
            Results:   null,
            
            Parent:    null,
            Next:      null,
            Previous:  null,
            Root:      null,

            RootIndex: -1
        }
    }




    public static p(...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
    public static p(p_Alias:  string, 
                    ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
    public static p(p_Param1: string | CallsStruct | ParallelStruct | SequentialStruct, 
                    ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct
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


        const structParallel: ParallelStruct = 
        {
            Alias:    strAlias,
            Type:     CallTypes.Parallel,

            Calls:    arrStructs,
            
            Invoked:  false,
            Error:    null,
            Results:  null,
            
            Parent:   null,
            Next:     null,
            Previous: null,
            Root:     null
        }

        // Set parent
        for (let structCall of structParallel.Calls)
        {
            structCall.Parent = <CallsStruct><unknown>structParallel;
        }


        return structParallel;
    }




    public static s(...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): SequentialStruct;
    public static s(p_Alias:  string, 
                    ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): SequentialStruct;
    public static s(p_Param1: string | CallsStruct | ParallelStruct | SequentialStruct, 
                    ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): SequentialStruct
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


        const structSequential: SequentialStruct = 
        {
            Alias: strAlias,
            Type:  CallTypes.Sequential,

            Calls:    arrStructs,
            
            Invoked:  false,
            Error:    null,
            Results:  null,
            
            Parent:   null,
            Next:     null,
            Previous: null,
            Root:     null
        }

        // Set parent, previous, next
        for (let intA = 0; intA < structSequential.Calls.length; intA++)
        {
            const structCall: CallsStruct = <CallsStruct><unknown>structSequential.Calls[intA];

            // Parent
            structCall.Parent = <CallsStruct><unknown>structSequential;

            // Previous and next
            if (intA < structSequential.Calls.length - 1)
                structCall.Next = <CallsStruct><unknown>structSequential.Calls[intA + 1];
            if (intA > 0)
                structCall.Previous = <CallsStruct><unknown>structSequential.Calls[intA - 1];
        }


        return structSequential;
    }




    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number): Promise<Result>;
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean): Promise<Result>;
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean): Promise<Result>;
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_Callback: (p_Error: any) => void): void;
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Callback: (p_Error: any) => void): void;
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_BreakOnError:  boolean,
                    p_Stats:         boolean,
                    p_Callback: (p_Error: any) => void): void
    public static r(p_CallStruct:    ParallelStruct | SequentialStruct, 
                    p_Timeout:       number,
                    p_Param3?:       boolean | Function,
                    p_Param4?:       boolean | Function,
                    p_Param5?: (p_Error: any) => void): void | Promise<Result>
    {
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



        // Root values
        const structRoot: RootStruct = (<RootStruct><unknown>p_CallStruct);
        structRoot.CallSize       = 0;


        // Function to set root 
        const fnSetRoot: Function = function(p_Root:               CallsStruct,
                                             p_CallStructSetRoot?: CallsStruct | ParallelStruct | SequentialStruct): void
        {
            // If second parameter is absent, we are in root element
            if (p_CallStructSetRoot)
                p_CallStructSetRoot.Root = p_Root;
            else
                p_CallStructSetRoot = p_Root;


            // Set root in children
            if (p_CallStructSetRoot.Type === CallTypes.Parallel || 
                p_CallStructSetRoot.Type === CallTypes.Sequential)
            {
                for (let structCallSetRoot of p_CallStructSetRoot.Calls)
                {
                    fnSetRoot(p_Root, structCallSetRoot);
                }
            }


            // Set call position in main call struct
            else if (p_CallStructSetRoot.Type === CallTypes.Function)
            {
                (<CallsStruct><unknown>p_CallStructSetRoot).RootIndex = ++(<RootStruct><unknown>p_Root).CallSize;
            }
        };


        // Set root in children
        fnSetRoot( p_CallStruct)


        const prmsReturn: Promise<Result> = new Promise( (resolve, reject) =>
        {
//            resolve()
            // Main result object
            structRoot.MainResult = new Result(structRoot.CallSize,
                                            () => { 
                                                resolve(structRoot.MainResult);
                                            });



            CB.#Invoke(p_CallStruct);
        });


        if (!fnCallback)
        {
            return prmsReturn;
        }
        else
        {
            prmsReturn.then( value => fnCallback(null, value) );
        }
    }



    static #Invoke(p_Call: CallsStruct | ParallelStruct | SequentialStruct): void
    {
        const fnCallback: Function = function()
        {
            p_Call.Invoked = true;
            p_Call.Error   = arguments[0];
            p_Call.Results = Array.prototype.slice.call(arguments, 1);


            (<RootStruct><unknown>p_Call.Root).MainResult.SetResult( (<CallsStruct>p_Call).RootIndex, 
                                                                      p_Call.Alias, 
                                                                      p_Call.Error, 
                                                                      0, 
                                                                      p_Call.Results);

            if (p_Call.Next)
            {
                CB.#Invoke(p_Call.Next);
            }
        }


        switch (p_Call.Type)
        {
            case CallTypes.Function:
                setImmediate( () => p_Call.Fn(...p_Call.Args, fnCallback));
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













// //export type TFunctions    = [fn: ( ...p_Arg: any|undefined)=> void, ...args: any];
// //export type TFunctions    =  [TFunction[]];
// //|[[Function, ...any]]; // TODO :: Set function in first element

// type TFunction    =   [Object|undefined, Function, ...any]
// type TFunctions    = any[];
// type TMainCallback = (p_Timedout: boolean, 
//                              p_Results:  any[]) => void;




// function ParallelCallbacks(p_MainCallback: TMainCallback,
//                                     p_Timeout:      number,
//                                     p_Fns:          TFunction): void;
// function ParallelCallbacks(p_MainCallback: TMainCallback,
//                                     p_Timeout:      number,
//                                     ...p_Fns:       TFunctions): void;
// function ParallelCallbacks(p_MainCallback: TMainCallback,
//                                     p_Timeout:      number,
//                                     ...p_Fns:       TFunction | TFunctions): void
// {
//     // Check params
//     if (Array.isArray(p_Fns[0]))
//         p_Fns = <TFunction>p_Fns[0];


//     const intFns:      number  = p_Fns.length,
//           arrResults:  any[]   = new Array(intFns);
//     let   intCbs:      number  = 0,
//           blnTimedout: boolean = false;



//     // Set timeout
//     const ptrTimeout = setTimeout(
//         () => 
//         {
//             if (blnTimedout) return;

//             blnTimedout = true;

//             p_MainCallback(true, arrResults);
//         },
//         p_Timeout
//     );
  


//     const fnCreateCallback = function(p_Index: number)
//     {
//         return function()
//         {
//             // Store function results (first argument as error, all other as return of the call)
//             arrResults[p_Index] = arguments;

            
//             // Increment fn callbacks called
//             intCbs++;


//             // Call main callback when all settled
//             if (intCbs === intFns && !blnTimedout)
//             {
//                 // Clears timeout
//                 clearTimeout(ptrTimeout);
                

//                 // Callback
//                 p_MainCallback(false, arrResults);
//                 return;
//             }

//         }

//     }

//     // // Functions call back (called for every function in p_Fns)
//     // const fnsCallback: () => void = function()
//     // {
//     //     // Store function results (first argument as error, all other as return of the call)
//     //     arrResults[intCbs] = [arguments[0], Array.prototype.slice.call(arguments, 1)];

        
//     //     // Increment fn callbacks called
//     //     intCbs++;


//     //     // Call main callback when all settled
//     //     if (intCbs === intFns && !blnTimedout)
//     //     {
//     //         // Clears timeout
//     //         clearTimeout(ptrTimeout);
            

//     //         // Callback
//     //         p_MainCallback(false, arrResults);
//     //         return;
//     //     }
//     // }


// 7
//     p_Fns.forEach( (fn: TFunctions, p_Index: number) => 
//     {
//         let arrArguments: any[] = [];
//         for (let intA = 2; intA < fn.length; intA++)
//             arrArguments.push(fn[intA]);


//         // Add callback to arguments to be passed to function
//         //arrArguments.push(fnsCallback);
//         arrArguments.push(fnCreateCallback(p_Index));


//         // Call function with arguments
//         setImmediate(() => 
//         {
//             fn[1].apply(fn[0], <[]>arrArguments)
//         });
//     });
// }




// interface IInvocable
// {
//     Invoke(): void;
//     Next?:    IInvocable
// }



// class CBFunction implements IInvocable
// {
//     constructor(p_Alias: string,
//                 p_FN:    Function,
//                 p_Args?: any[])
//     {
//         this.#Alias   = p_Alias;
//         this.#Fn      = p_FN;
//         this.#Args    = p_Args;
//         this.#Invoked = false
//     }
    

//     #Alias:    string;
//     #Fn:       Function;
//     #Args?:    any;

//     #Invoked:  boolean = false;

//     #Error:    any;
//     #Results?: [];

//     public Next:    CBFunction | undefined;


//     Invoke(): void
//     {
//         const fnSetResult = (p_Arguments: any) => 
//         { 
//             this.#Results = p_Arguments; 
//             if (this.Next) 
//                 this.Next.Invoke()  
//         } ;
//         const fnCallback  = function() { fnSetResult(arguments)};

//         setTimeout( () => this.#Fn(...this.#Args, fnCallback) , 0) 
//         this.#Invoked = true;
//     }
// }

// let intTO: number = 200;

// class CBParallelClass implements IInvocable
// {
//     constructor(...p_ParallelFns: Array<IInvocable>)
//     {
//         this.#_Fns = p_ParallelFns;
//     }

//     #_Fns: Array<IInvocable>;

//     public Invoke()
//     {
//         this.#_Fns.forEach( fn => 
//         {            
//             setTimeout( () => fn.Invoke() , intTO) 
//             intTO -= 20;
//         });
//     }
// }



// class CBSequentialClass implements IInvocable
// {
//     constructor(...p_Fns: Array<IInvocable>)
//     {
//         this.#_Fns = p_Fns;

//         for (let intA = 0; intA <= p_Fns.length - 2; intA++)
//         {
//             this.#_Fns[intA].Next = this.#_Fns[intA + 1];
//         }
//     }

//     #_Fns: Array<IInvocable>;


    
//     public Invoke()
//     {
//         this.#_Fns[0].Invoke()
//     }
// }


// function CbFn(p_Alias:  string,   p_Fn: Function, ...p_Args: any): CBFunction;
// function CbFn(p_Fn:     Function, ...p_Args: any): CBFunction;
// function CbFn(p_Param1: string | Function, p_Param2: any, ...p_Args: any): CBFunction
// {
//     let strAlias: string;
//     let fn:       Function;
//     let arrArgs:  Array<any>;

//     if ("string" === typeof p_Param1)
//     {
//         strAlias = p_Param1;
//         fn       = p_Param2;
//         arrArgs  = [ ...p_Args ];
//     }
//     else
//     {
//         strAlias = ""
//         fn       = p_Param1;
//         arrArgs  = [ p_Param2, ...p_Args ];
//     }
//     return new CBFunction(strAlias, fn, arrArgs)
// }




// function CBParallel(...p_Fns: Array<CBFunction| CBSequentialClass | CBParallelClass>): CBParallelClass
// {
//     return new CBParallelClass(...p_Fns);
// }


// function CBSeq(...p_Fns: Array<CBFunction| CBSequentialClass | CBParallelClass>): any
// {
//     return new CBSequentialClass(...p_Fns);    
// }


// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number): Promise<any>;
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_BreakOnError:  boolean): Promise<any>;
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_BreakOnError:  boolean,
//                p_Stats:         boolean): Promise<any>;
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_Callback: (p_Error: any) => void): void;
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_BreakOnError:  boolean,
//                p_Callback: (p_Error: any) => void): void;
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_BreakOnError:  boolean,
//                p_Stats:         boolean,
//                p_Callback: (p_Error: any) => void): void
// function CBRun(p_CallStruct:    any, 
//                p_Timeout:       number,
//                p_Param3?:       boolean | Function,
//                p_Param4?:       boolean | Function,
//                p_Param5?: (p_Error: any) => void): void | Promise<any>
// {

//     let fnCallback:      Function,
//         blnBreakOnError: boolean,
//         blnStats:        boolean;
    
//     if ("function" === typeof p_Param3)
//     {
//         fnCallback = p_Param3;

//         // Default values
//         blnBreakOnError = true;
//         blnStats        = false;
//     }
//     else if ("function" === typeof p_Param4)
//     {
//         fnCallback      = p_Param4;
//         blnBreakOnError = p_Param3 || true;
        
//         // Default value
//         blnStats = false;
//     }
//     else if ("function" === typeof p_Param5)
//     {
//         fnCallback      = p_Param5;
//         blnBreakOnError = p_Param3 || true;
//         blnStats        = p_Param4 || false;
//     }

// }



// //CBRun()

// const fnTeste = (p_Value: any, p_Callback: (...arg: any)=> void) => 
// {

//     console.log(p_Value);
//     return p_Callback("value 1");
// }

// const PREVIOUS_ERROR : Symbol = Symbol("PREVIOUS_ERROR");
// const PREVIOUS_RESULT: Symbol = Symbol("PREVIOUS_RESULT");



// const cbFnsP = CBParallel( CbFn( fnTeste, "P 1"),
//                            CbFn( fnTeste, "P 2"),
//                            CbFn( fnTeste, "P 3"),
//                            CBSeq ( CbFn( fnTeste, "S 1"),
//                                    CbFn( fnTeste, "S 2")),
//                            CbFn( fnTeste, "P 4"));

// const cbFnsS = CBSeq( CbFn( fnTeste, "S 1"),
//                       CbFn( fnTeste, "S 2"),
//                       CbFn( fnTeste, "S 3"),
//                       CBParallel ( CbFn( fnTeste, "P 1"),
//                                    CbFn( fnTeste, "P 2")),
//                       CbFn( fnTeste, "S 4"));


// const és = function(): void {}
// /*
// CB.f();
// CB.s();
// CB.p();
// CB.run();

// await result = CB.run( CB.p("alias p 1" 
//                             CB.f("alias 1", fnTeste, "P 1"),
//                             CB.f("alias 2", fnTeste, "P 2"),
//                             CB.f("alias 3", fnTeste, "P 1"), 
//                             CB.s("alias s 1", 
//                                     CB.f("alias 4", fnTeste, "P 1"),
//                                     CB.f("alias 5", fnTeste, "P 1"),
//                                     CB.f("alias 6", fnTeste, "P 1")),
//                             CB.f("alias 8", fnTeste, "P 1")));


// */
// cbFnsP.Invoke();
// cbFnsS.Invoke();


// //console.log("teste");
// // CbRun(): void
// // {

// // }



// class Result
// {
//     List(): void
//     {

//     }

//     Tree(): void
//     {

//     }

//     Alias(p_Alias: string): void
//     {

//     }
// }


// //console.log(util.inspect(cbFnsP, {depth: 5, showHidden: true}));