export const fnTestWithTimeout: Function = function (p_Array:    string[],
                                                     p_Timeout:  number,
                                                     p_Value:    string, 
                                                     p_Callback: Function)
{
    setTimeout( () =>
    {
        p_Array.push(p_Value);
        p_Callback(null, p_Value + " returned from callback");
    }, 
    p_Timeout);
}



export const fnTest: Function = function (p_Array:    string[],
                                          p_Value:    string, 
                                          p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value + " returned from callback");
}


export const fnTestWithError: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(new Error("Error test"));
}




export const fnTestException: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Callback: Function)
{
    throw new Error("Error in fn");
}


export const fnTestPrevious1: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Value + " " + p_Previous1);
    p_Callback(null, p_Value + " " + p_Previous1 + " returned from callback");
}