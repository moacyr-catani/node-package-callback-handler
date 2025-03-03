import { InternalResult } from "./result";



export enum CallTypes
{
    Function   = "F",
    Parallel   = "P",
    Sequential = "S"
}



export type BaseStruct =
{
    Type:        CallTypes;
    Alias:       string; 


    Exception?:  any;
    Invoked:     boolean;
    

    Parent:      ExecStruct | null;
    Next:        ExecStruct | CallsStruct | null;
    Previous:    ExecStruct | CallsStruct | null;
    Root:        ExecStruct | null;

    RootIndex:   number;
    ParentIndex: number;
}



export type ExecStruct = BaseStruct &
{
    Type:      CallTypes.Parallel | CallTypes.Sequential;
    Calls:     CallsStruct[],
    CallCount: number,
    Error:     boolean;
    Errors:    any[];
    Results:   any[];
}



export type RootStruct = ExecStruct &
{
    Break?:     boolean;
    MainResult: InternalResult;
    PlainCalls: Array<ExecStruct | CallsStruct>;
}


export type CallsStruct = BaseStruct &
{
    Type:        CallTypes.Function;
    Fn:          Function;
    Args:        any[];
    UseToken:    boolean;
    
    Error:       any | null;
    Results:     any[] | null;
}