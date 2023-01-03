const { Schema } = require('./../src/')


const userSchema = new Schema({
    firstName: { required: true, type: "string" },
    lastName: { required: true, type: "string" },
    surnName: "string",
    username: {
        type: "string",
        default: "anonymous",
        modifyValue: value => value.split(' ').join('-')
    },
    dateOfBirth: { type: "date", datify: true },
    friends: {
        type: "array",
        required: true,
        $_data: [{
            firstName: { required: true, type: "string" },
            lastName: { required: true, type: "string" },
            surnName: "string",
            username: {
                type: "string",
                default: "anonymous",
                modifyValue: value => value.split(' ').join('-')
            },
            dateOfBirth: { type: "date", datify: true },
        }]
    }
})


test("Sucess: User with friends schema, complete with array of object and datify: true", () => {
    expect(
        userSchema.validate({
            firstName: "Paul",
            lastName: "Ezekiel-Hart",
            username: "slick codes",
            dateOfBirth: "2023-02-1",
            friends: [{
                firstName: "Samuel",
                lastName: "Jackson",
                surnName: "Logan",
                username: "sam-jack"
            }, {
                firstName: "John",
                lastName: "Doe"
            }, {
                firstName: "Sutain",
                lastName: "Stephani",
                username: "sammy25"
            }]
        })

    ).toEqual({
        error: null,
        isValid: true,
        data: {
            firstName: 'Paul',
            lastName: 'Ezekiel-Hart',
            username: 'slick-codes',
            dateOfBirth: new Date("2023-01-31T23:00:00.000Z"),
            friends: [
                {
                    firstName: 'Samuel',
                    lastName: 'Jackson',
                    surnName: 'Logan',
                    username: 'sam-jack'
                },
                { firstName: 'John', lastName: 'Doe', username: 'anonymous' },
                { firstName: 'Sutain', lastName: 'Stephani', username: 'sammy25' }
            ]
        }
    });
});



