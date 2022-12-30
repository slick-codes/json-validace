const simpleSchemas = require('./schema/simple.schema')


// test: login form with no errors
test("Sucess ~ Login Form", () => {
    expect(
        simpleSchemas.loginForm.validate({
            email: "test@gmail.com",
            password: "slickcodes",
        })
    ).toEqual({
        error: null,
        isValid: true,
        data: { email: "test@gmail.com", password: "slickcodes" },
    });
});

// test: test length check and email type error
test("Failed - Login Form  - inproper email type and password length problems", () => {
    expect(
        simpleSchemas.loginForm.validate({
            email: "test",
            password: "some",
        })
    ).toEqual({
        error: {
            password: { minLength: "password should be 8 characters or above" },
            email: { type: ' "email" value is not a email' },
        },
        isValid: false,
        data: null,
    });
});

test("Sucess - Signup form", () => {
    expect(
        simpleSchemas.signupSchema.validate({
            firstName: "Paul",
            lastName: "Ezekiel-Hart",
            password: "slickcodes",
            username: "slick",
            email: "test@gmail.com",
            hobbies: ["Video Game", "Coding", "Designing"],
            skinTone: "Black",
            height: 7.8,
            gender: "MALE",
            dateOfBirth: "1997-10-17",
        })
    ).toEqual({
        error: null,
        isValid: true,
        data: {
            firstName: "Paul",
            lastName: "Ezekiel-Hart",
            password: "slickcodes",
            username: "slick",
            email: "test@gmail.com",
            hobbies: ["Video Game", "Coding", "Designing"],
            skinTone: "black",
            height: 7.8,
            gender: "male",
            dateOfBirth: "1997-10-17",
        },
    });
});

// make Signup fail
test("Failed ~ Signup form: (test: required, email, array with no $_data, dateOfBirth, floats,maxLength)", () => {
    expect(
        simpleSchemas.signupSchema.validate({
            lastName: "Ezekiel-Hart",
            password: "slickcodesincreasethepasswordpassitslimit",
            email: "test@gmail",
            hobbies: ["Video Game", "Coding", "Designing"],
            skinTone: "Yellow",
            height: 7.866,
            gender: "male",
            dateOfBirth: "1997-10-17",
        })
    ).toEqual({
        error: {
            firstName: { required: '"firstName" feild is required!' },
            password: { minLength: " password should be 20 characters or below. " },
            email: { type: ' "email" value is not a email' },
            skinTone: {
                enum: " skinTone should be an enum of (black | white | brown)",
            },
        },
        isValid: false,
        data: null,
    });
});

// test: Test if datatype is an array
test("Success ~ Array type is valid", () => {
    expect(
        simpleSchemas.musicObject.validate({
            name: "Rema",
            songs: ["Divine", "Woman", "Dumebi"],
            date: "2018-10-06",
        })
    ).toEqual({
        error: null,
        isValid: true,
        data: {
            name: "Rema",
            songs: ["Divine", "Woman", "Dumebi"],
            date: "2018-10-06",
        },
    });
});
