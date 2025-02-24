export declare enum CallTypes {
    Function = "F",
    Parallel = "P",
    Sequential = "S"
}
type BaseStruct = {
    Type: CallTypes;
    Alias: string;
    Invoked: boolean;
    Error: any | null;
    Results: any[] | null;
    Parent: CallsStruct | null;
    Next: CallsStruct | null;
    Previous: CallsStruct | null;
};
export type ParallelStruct = BaseStruct & {
    Type: CallTypes.Parallel;
    Calls: CallsStruct[];
};
export type SequentialStruct = BaseStruct & {
    Type: CallTypes.Sequential;
    Calls: CallsStruct[];
};
export type CallsStruct = BaseStruct & {
    Type: CallTypes.Function;
    Fn: Function;
    Args?: any;
};
export {};
//# sourceMappingURL=calls-struct.d.ts.map