import util from "node:util";
import { CB } from "./../src/callback-handler";




const fnTeste = (p_Value: string, p_Callback: Function) =>
{
    // Up to 1/2 second before function returns
    const intTimeout: number = Math.random() * 500;


    setTimeout( () =>
    {
        console.log(p_Value);
        p_Callback(null, p_Value + " returned from callback");
    }, 
    intTimeout);

    //throw new Error("error ---");


    // console.log(p_Value);
    // p_Callback(null, p_Value + " returned from callback");

}



const calls   = CB.p( "Parallel calls 1" ,
                      CB.f (fnTeste, "P1"),
                      CB.f (fnTeste, "P2"),
                      CB.f (fnTeste, "P3"),
                      CB.s ( "Sequential call 1",
                             CB.f (fnTeste, "S1"),
                             CB.f (fnTeste, "S2"),
                             CB.f (fnTeste, "S3"),
                             CB.p ( "Parallel calls in a sequence call",
                                    CB.f (fnTeste, "S4 P1"),
                                    CB.f (fnTeste, "S4 P2"),
                                    CB.f (fnTeste, "S4 P3")
                            )
                      ),
                      CB.s ( "Sequential call 2",
                             CB.f ("alias", fnTeste, "S5"),
                             CB.f (fnTeste, "S6"),
                             CB.f (fnTeste, "S7")
                      )
                );


CB.r(calls, 2000)
.then ( objResult => 
{
    //console.log(objResult);
    //console.log(objResult.ByAlias("alias"));
    console.log(objResult.ByPosition(2));
    console.log(objResult.ByPosition(3));
    //console.log(util.inspect(calls, {showHidden: true, depth: 4}));
})
.catch ( (p_Exception) =>
{
    console.log(p_Exception);
}); 