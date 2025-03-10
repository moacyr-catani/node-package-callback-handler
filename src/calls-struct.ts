import { InternalResult } from "./result.js";



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
    Finished:    boolean;

    Parent:      ExecStruct | null;
    Next:        ExecStruct | FunctionStruct | null;
    Previous:    ExecStruct | FunctionStruct | null;
    Root:        ExecStruct | null;

    RootIndex:   number;
    ParentIndex: number;

    TsStart:     number;
    TsFinish:    number;
}



export type ExecStruct = BaseStruct &
{
    Type:      CallTypes.Parallel | CallTypes.Sequential;
    CallCount: number;
    CallQty:   number;
    Calls:     FunctionStruct[];
}



export type RootStruct = ExecStruct &
{
    Break?:     boolean;
    MainResult: InternalResult;
    PlainCalls: Array<ExecStruct | FunctionStruct>;
    GetStats:   boolean;
}



export type FunctionStruct = BaseStruct &
{
    Type:        CallTypes.Function;
    Fn:          Function;
    Args:        any[];
    UseToken:    boolean;
}