export class CallResult
{
    constructor(p_Error: any, p_Results: any)
    {
        this.#_Error   = p_Error;
        this.#_Results = p_Results;

        Object.seal(this);
    }


    // Private holders
    #_Error:   any;
    #_Results: any;


    // Public properties
    public get Error():   any { return this.#_Error}
    public get Results(): any { return this.#_Results}
}



export class Result 
{
    constructor(p_CallsCount: number,
                p_onFinish:   Function)
    {
        this.#_CallsCount = p_CallsCount;
        this.#_onFinish   = p_onFinish;
    }


    // Private fields
    #_Error:        boolean = false;
    #_AliasResult:  Record<string, CallResult> = {};
    #_CallResults:  Array<CallResult> = [];
    #_onFinish:     Function;
    #_ResultsCount: number = 0;
    #_CallsCount:   number = 0;



    public get Error(): boolean
    {
        return this.#_Error;
    }



    public get Results(): Array<CallResult>
    {
        return this.#_CallResults;
    }



    public ByPosition(p_Position: number): CallResult
    {
        return this.#_CallResults[p_Position];
    }



    public ByAlias(p_Alias: string): CallResult
    {
        return this.#_AliasResult[p_Alias];
    }


    public SetResult(p_Index:   number, 
                     p_Alias:   string, 
                     p_Error:   any, 
                     p_Stats:   number, 
                     p_Results: any[] | null): void
    {
        this.#_CallResults[p_Index] = new CallResult(p_Error, p_Results);

        if (p_Alias !== "")
        {
            this.#_AliasResult[p_Alias] = new CallResult(p_Error, p_Results);
        }

        this.#_ResultsCount++;

        if (this.#_ResultsCount >= this.#_CallsCount)
        {
            this.#_onFinish();
        }
    }
}