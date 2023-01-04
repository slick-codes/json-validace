const { Schema } = require('./../src/')

const loginSchema = new Schema({
    email: { type: "email", required: true },
    password: { type: "string", required: true, maxLength: 20, minLength: 8 }
})



test("Testing min and max Length", () => {
    expect(loginSchema.validate({
        email: "test@gmail.com",
        password: "food" // length = 4
    })).toEqual({
        error: {
            password: { minLength: 'password should be 8 characters or above' }
        },
        isValid: false,
        data: null
    })
})

const studentSchema = new Schema({
    name: { type: "string", required: true },
    id: { type: "number", required: true },
    essey: {
        type: "string",
        required: true,
        minLength: 500,
        maxLength: 1000
    },
    hobbies: {
        type: "array",
        maxLength: 3
    }
})

test("Fail: min - max length", () => {
    expect(studentSchema.validate({
        name: "John Doe",
        id: 4934,
        essey: "Introduction: Exercise is an essential part of a healthy lifestyle, and it offers numerous physical and mental benefits. Studies have shown that regular exercise can help reduce the risk of chronic",
        hobbies: ["Football", "Video Games", "Coding", "Dancing"]
    })).toEqual({
        error: {
            essey: { minLength: 'essey should be 500 characters or above' },
            hobbies: { maxLength: ' hobbies should be 3 items or below. ' }
        },
        isValid: false,
        data: null
    })
})