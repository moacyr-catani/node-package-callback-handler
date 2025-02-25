import { Result } from "./result";



export enum CallTypes
{
    Function   = "F",
    Parallel   = "P",
    Sequential = "S"
}



export type BaseStruct =
{
    Type:     CallTypes;
    Alias:    string;

    Invoked:  boolean;
    Error:    any | null;
    Results:  any[] | null;

    Parent:   CallsStruct | null;
    Next:     CallsStruct | null;
    Previous: CallsStruct | null;
    Root:     CallsStruct | null;
}

export type RootStruct = BaseStruct &
{
    MainResult:     Result;
    CallSize:       number
}

export type ParallelStruct = BaseStruct &
{
    Type:     CallTypes.Parallel;
    Calls:    CallsStruct[]
}

export type SequentialStruct = BaseStruct &
{
    Type:     CallTypes.Sequential;
    Calls:    CallsStruct[]
}

export type CallsStruct = BaseStruct &
{
    Type:      CallTypes.Function;
    Fn:        Function;
    Args?:     any;
    RootIndex: number;
}