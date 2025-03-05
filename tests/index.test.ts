import * as MainExports from '../src/index';

describe('MyLib', () => 
{
    test('Exports', () => 
    {
        expect(MainExports).toEqual(expect.any(Object));
    });


    
    test('No undefined exports', () => 
    {
        for (const k of Object.keys(MainExports))
        {
            expect(MainExports).not.toHaveProperty(k, undefined);
        }
    });
});