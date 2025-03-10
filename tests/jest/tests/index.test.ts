import * as Exports from '../../../src/index';

describe('Package', () => 
{
    test('Exports', () => 
    {
        expect(Exports).toEqual(expect.any(Object));
    });


    
    test('No undefined exports', () => 
    {
        for (const k of Object.keys(Exports))
        {
            expect(Exports).not.toHaveProperty(k, undefined);
        }
    });
});