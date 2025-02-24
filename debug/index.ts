import util from "node:util";
import { CB } from "./../src/callback-handler";




const fnTeste = (p_Value: string, p_Callback: Function) =>
{
    console.log(p_Value)
}



const calls   = CB.p( "Parallel calls 1" ,
                      CB.f (fnTeste, "P1"),
                      CB.f (fnTeste, "P2"),
                      CB.f (fnTeste, "P3"),
                      CB.s ( "Sequential call 1",
                             CB.f (fnTeste, "S1"),
                             CB.f (fnTeste, "S2"),
                             CB.f (fnTeste, "S3")
                      ),
                      CB.s ( "Sequential call 2",
                             CB.f (fnTeste, "S2"),
                             CB.f (fnTeste, "S3"),
                             CB.f (fnTeste, "S4")
                      )
                )


console.log(util.inspect(calls, {showHidden: true, depth: 4}));