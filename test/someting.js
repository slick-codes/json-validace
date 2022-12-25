const jsonValidace = require('./simple.schema.js')



console.log(jsonValidace.signupSchema.validate({
    lastName: "Ezekiel-Hart",
    password: "slickcodesincreasethepasswordpassitslimit",
    email: "test@gmail",
    hobbies: ["Video Game", "Coding", "Designing"],
    skinTone: "Yellow",
    height: 7.866,
    gender: "male",
    dateOfBirth: "1997-10-17"
}))