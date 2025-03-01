export type TError = 
{
    message: string, 
    explanation?: string
};



export enum CBExceptions
{
    NoError                  = 0,
    InternalError            = 1,
    ExecutionException       = 2,
    ResultAlreadySet         = 3,
    TokenInFirstCall         = 4,

}




const ERRORS_DETAILS: Record<CBExceptions, TError> = 
{
    [CBExceptions.NoError]:                  {message: "No error"},
    [CBExceptions.InternalError]:            {message: "Internal error ocurred",             explanation: "Something unexpected happened. Check baseException property to get more info"},
    [CBExceptions.ExecutionException]:       {message: "Execution exception",                explanation: "An exception was thrown during the execution of call struct"},
    [CBExceptions.ResultAlreadySet]:         {message: "Result was set more than once",      explanation: "A callback function was invoked more than onde, creating double results for a call"},
    [CBExceptions.TokenInFirstCall]:         {message: "Invalid use of token in first call", explanation: "You've tried to use a token to access previous result in the first call, which has no previous result to access"},
};




export class CBException extends Error
{
    constructor(p_ErrorNumber:    CBExceptions, 
                p_BaseException?: Error);
    constructor(p_ErrorNumber:    CBExceptions, 
                p_Detail?:        string | Error, 
                p_Stack?:         string,
                p_BaseException?: Error);
    constructor(p_ErrorNumber:    CBExceptions, 
                p_DorE?:          string | Error, 
                p_Stack?:         string,
                p_BaseException?: Error)
    {
        super(ERRORS_DETAILS[p_ErrorNumber].message);

        let strDetails:       string | undefined,
            objBaseException: Error | undefined

        if ("string" === typeof p_DorE)
        {
            strDetails       = p_DorE;
            objBaseException = p_BaseException;
        }
        else
        {
            objBaseException = p_DorE;
        }

        this.errorNumber = p_ErrorNumber;

        if (strDetails)       this.details       = strDetails;
        if (p_Stack)          this.stack         = p_Stack;
        if (objBaseException) this.baseException = objBaseException;

        if (ERRORS_DETAILS[p_ErrorNumber].explanation)
            this.explanation = ERRORS_DETAILS[p_ErrorNumber].explanation;
    }


    public errorNumber:    number;
    public details?:       string;
    public baseException?: Error;
    public explanation?:   string;
}