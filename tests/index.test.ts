import * as MainExports from '../src/index';

describe('Package', () => 
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