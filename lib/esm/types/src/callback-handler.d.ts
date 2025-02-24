import { CallsStruct, ParallelStruct, SequentialStruct } from "./calls-struct";
export declare abstract class CB {
    static f(p_Alias: string, p_Fn: Function, ...p_Args: any): CallsStruct;
    static f(p_Fn: Function, ...p_Args: any): CallsStruct;
    static p(...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
    static p(p_Alias: string, ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
    static s(...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
    static s(p_Alias: string, ...p_Fns: Array<CallsStruct | ParallelStruct | SequentialStruct>): ParallelStruct;
}
//# sourceMappingURL=callback-handler.d.ts.map