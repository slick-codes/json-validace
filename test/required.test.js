const { Schema } = require('./../src')
const signupSchema = new Schema({
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    surname: { type: "string", required: false },
    username: { type: "string", default: "anonymous" },
    dateOfBirth: { type: "date", required: false },
    gender: {
        type: "string",
        required: true,
    }
})


// console.log(signupSchema.validate({}))

test("Testing Required.", () => {
    expect(signupSchema.validate({
        firstName: "John"
    }))
        .toEqual({
            error: {
                lastName: { required: '"lastName" feild is required!' },
                gender: { required: '"gender" feild is required!' }
            },
            isValid: false,
            data: null
        });
});