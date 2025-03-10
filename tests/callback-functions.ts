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



export const fnTestTwoCallbacks: Function = function (p_Array:    string[],
                                                      p_Value:    string, 
                                                      p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value + " returned from callback");
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
    console.log(p_Array, p_Value, p_Callback);
    throw new Error("Error in fn");
}



export const fnTestPrevious0: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value);
}



export const fnTestPrevious1: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1);
}



export const fnTestPrevious2: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2);
}



export const fnTestPrevious3: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3);
}



export const fnTestPrevious4: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4);
}



export const fnTestPrevious5: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Previous5: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5);
}



export const fnTestPrevious6: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Previous5: string,
                                                   p_Previous6: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6);
}



export const fnTestPrevious7: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Previous5: string,
                                                   p_Previous6: string,
                                                   p_Previous7: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7);
}



export const fnTestPrevious8: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Previous5: string,
                                                   p_Previous6: string,
                                                   p_Previous7: string,
                                                   p_Previous8: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous8 + " " + p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7, p_Previous8);
}



export const fnTestPrevious9: Function = function (p_Array:    string[],
                                                   p_Value:    string, 
                                                   p_Previous1: string,
                                                   p_Previous2: string,
                                                   p_Previous3: string,
                                                   p_Previous4: string,
                                                   p_Previous5: string,
                                                   p_Previous6: string,
                                                   p_Previous7: string,
                                                   p_Previous8: string,
                                                   p_Previous9: string,
                                                   p_Callback: Function)
{
    p_Array.push(p_Previous9 + " " + p_Previous8 + " " + p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7, p_Previous8, p_Previous9);
}



export const fnTestPreviousError: Function = function (p_Array:         string[],
                                                       p_Value:         string, 
                                                       p_PreviousError: any,
                                                       p_Callback:      Function)
{
    p_Array.push(p_PreviousError ? "error" : "no error");
    p_Callback(null, p_Value);
}