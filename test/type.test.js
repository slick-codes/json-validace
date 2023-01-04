const { Schema } = require('./../src/')

const loginSchema = new Schema({
    password: { type: "string" },
    email: { type: "email" }
})


test("Testing Type", () => {
    expect(loginSchema.validate({
        email: "slickcodes@mail", // this should be an email
        password: 59489483 // this should be a valid string
    })
    ).toEqual({
        error: {
            password: { type: ' "password" value is not a string' },
            email: { type: ' "email" value is not a email' }
        },
        isValid: false,
        data: null
    });
});