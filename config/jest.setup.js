function toMatchResponsePayloadStructure(actual, expected){
    let pass = true;
    for(let key of Object.keys(actual)){
        pass = expected.hasOwnProperty(key);
    }
    for(let key of Object.keys(expected)){
        pass = actual.hasOwnProperty(key);
    }
    return {
        message: () => `
            expected ${Objet.keys(expected)} 
            to match structure ${Objet.keys(actual)}
        `,
        pass
    };
}

expect.extend({
    toMatchResponsePayloadStructure
 });