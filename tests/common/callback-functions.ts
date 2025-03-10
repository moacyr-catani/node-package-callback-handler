export function fnTestWithTimeout (p_Array:    string[],
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



export function fnTest (p_Array:    string[],
                        p_Value:    string, 
                        p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value + " returned from callback");
}



export function fnTestTwoCallbacks(p_Array:    string[],
                                   p_Value:    string, 
                                   p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value + " returned from callback");
    p_Callback(null, p_Value + " returned from callback");
}



export function fnTestWithError(p_Array:    string[],
                                p_Value:    string, 
                                p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(new Error("Error test"));
}



export function fnTestException(p_Array:    string[],
                                p_Value:    string, 
                                p_Callback: Function)
{
    p_Array.push(p_Value + " " + p_Callback.toString());
    throw new Error("Error in fn");
}



export function fnTestPrevious0(p_Array:    string[],
                                p_Value:    string, 
                                p_Callback: Function)
{
    p_Array.push(p_Value);
    p_Callback(null, p_Value);
}



export function fnTestPrevious1(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1);
}



export function fnTestPrevious2(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2);
}



export function fnTestPrevious3(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3);
}



export function fnTestPrevious4(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4);
}



export function fnTestPrevious5(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Previous5: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5);
}



export function fnTestPrevious6(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Previous5: string,
                                p_Previous6: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6);
}



export function fnTestPrevious7(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Previous5: string,
                                p_Previous6: string,
                                p_Previous7: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7);
}



export function fnTestPrevious8(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Previous5: string,
                                p_Previous6: string,
                                p_Previous7: string,
                                p_Previous8: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous8 + " " + p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7, p_Previous8);
}



export function fnTestPrevious9(p_Array:     string[],
                                p_Value:     string, 
                                p_Previous1: string,
                                p_Previous2: string,
                                p_Previous3: string,
                                p_Previous4: string,
                                p_Previous5: string,
                                p_Previous6: string,
                                p_Previous7: string,
                                p_Previous8: string,
                                p_Previous9: string,
                                p_Callback:  Function)
{
    p_Array.push(p_Previous9 + " " + p_Previous8 + " " + p_Previous7 + " " + p_Previous6 + " " + p_Previous5 + " " + p_Previous4 + " " + p_Previous3 + " " + p_Previous2 + " " + p_Previous1 + " " + p_Value);
    p_Callback(null, p_Value, p_Previous1, p_Previous2, p_Previous3, p_Previous4, p_Previous5, p_Previous6, p_Previous7, p_Previous8, p_Previous9);
}



export function fnTestPreviousError(p_Array:         string[],
                                    p_Value:         string, 
                                    p_PreviousError: any,
                                    p_Callback:      Function)
{
    p_Array.push(p_PreviousError ? "error" : "no error");
    p_Callback(null, p_Value);
}