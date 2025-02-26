import { Result } from "./result";



export enum CallTypes
{
    Function   = "F",
    Parallel   = "P",
    Sequential = "S"
}



export type BaseStruct =
{
    Type:       CallTypes;
    Alias:      string;

    Error:      any | null;
    Exception?: any;
    Invoked:    boolean;
    Results:    any[] | null;

    Parent:     CallsStruct | null;
    Next:       CallsStruct | null;
    Previous:   CallsStruct | null;
    Root:       CallsStruct | null;
}

export type RootStruct = BaseStruct &
{
    Break?:     boolean;
    CallSize:   number
    MainResult: Result;
    PlainCalls: Array<ExecStruct | CallsStruct>;
}

export type ExecStruct = BaseStruct &
{
    Type:     CallTypes.Parallel | CallTypes.Sequential;
    Calls:    CallsStruct[]
}

export type CallsStruct = BaseStruct &
{
    Type:      CallTypes.Function;
    Fn:        Function;
    Args?:     any;
    RootIndex: number;
}