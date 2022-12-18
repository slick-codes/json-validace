import validator from 'validator'

const Schema = class {
    constructor(schema, configuration) {
        this.schema = schema ?? {}
        this.nestedSchema = null
        this.supportedType = [
            "string",
            "number",
            "boolean",
            "email",
            "array",
            "object",
            "jwt",
            "mongoid"
        ]
        this.config = configuration ?? {
            // default configuration
            preventUnregisteredKeys: true
        }
    }

    validate(objectData) {
        const validData = {}
        const error = {}
        const schema = this.nestedSchema ?? this.schema

        const schemaKeys = Object.keys(schema)

        // Prevent users from using more keys than the Schema allows
        if (this.config.preventUnregisteredKeys)
            Object.keys(objectData).forEach(key => {
                if (!schemaKeys.includes(key))
                    throw new Error(`ValidaceError: "${key}" is not registered in the schema!`)
            })

        for (let schemaKey of schemaKeys) {
            // console.log(schemaKey)
            const dataValue = objectData[schemaKey]
            let schemaData = schema[schemaKey]

            // check if key has type 
            if (typeof schemaData !== 'string' && !schemaData.type)
                throw new Error(`ValidaceError: ${schemaKey} has no type declearation`)

            // check if key only has a type declearation
            if (typeof schemaData === 'string')
                schemaData = { type: schemaData }



            // check if the schema key exist in the data
            const valueExist = Object.keys(objectData).includes(schemaKey)
            const isTypeSupported = this.supportedType.includes(schemaData.type.toLowerCase())


            // Handle Type
            if (isTypeSupported) {
                if (!Array.isArray(schemaData.type)) {
                    const typeCheck = this.#typeValidation(schemaData.type, dataValue)
                    if (!typeCheck && valueExist)
                        throw new Error(`ValidaceError: "${schemaKey}" key is not a supported ${schemaData.type ?? 'datatype'}`)
                }
            }
            else {
                throw new Error(`ValidaceError: Syntax Error ~ "${schemaData.type}" is not a valid type`)
            }

            if (schemaData.$_validateInside && !schemaData.$_data)
                throw new Error('$_data feild is missing in schema')

            // validate nested obj schemas
            if (schemaData.type === 'object' &&
                schemaData.$_validateInside && dataValue) {
                this.nestedSchema = schemaData.$_data
                this.validate(dataValue)
                this.nestedSchema = null
            }
            // validate nested array of object schema
            if (schemaData.type === "array" && schemaData.$_validateInside) {
                for (let object of dataValue) {
                    this.nestedSchema = schemaData.$_data[0]
                    this.validate(object)
                }

            }

            // Handle Required feild
            if (schemaData.required && !dataValue)
                throw new Error(`ValidaceError: "${schemaKey}" feild is required!`)

            // Handle minLength && maxLength
            if (schemaData.minLength && dataValue.length < schemaData.minLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.minLength} characters and above`)
            else if (schemaData.maxLength && dataValue.length > schemaData.maxLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.maxLength} characters and below. `)

            // validate minValue and maxValue
            if (schemaData.minValue && dataValue > schemaData.minValue)
                throw new Error(`ValidaceError: ${schemaKey} is higher than ${schemaData.minValue}`)
            else if (schemaData.maxValue && dataValue < schemaData.maxValue)
                throw new Error(`ValidaceError: ${schemaKey} is lower than ${schemaData.maxValue}`)
            // Handle: cases lower and upper
            if (schemaData.toLower) {
                objectData[schemaKey] = objectData[schemaKey].toLowerCase()
            }
            else if (schemaData.toUpper)
                objectData[schemaKey] = objectData[schemaKey].toUpperCase()

            // Handle data modification (midifyValue) feild
            if (typeof schemaData.modifyValue === 'function')
                objectData[schemaKey] = schemaData.modifyValue(dataValue)


            // Handle: Enum
            if (schemaData.enum && !Array.isArray(schemaData.enum))
                throw new Error(`ValidaceError: ${schemaKey}.enum should be an array`)
            else if (schemaData.enum && !schemaData.enum.includes(objectData[schemaKey]))
                throw new Error(`ValidaceError: ${schemaKey} should be an enum of (${schemaData.enum.join(' | ')})`)

            // if (schemaData.enum && schemaData.enum)




            // Handle validate function
            if (typeof schemaData.validate === 'function')
                schemaData.validate(dataValue)
        }

        this.nestedSchema = null

        return {
            error: error,
            isValid: Object.keys(error).length === 0,
            data: objectData
        }
    }


    #typeValidation(type, value) {
        type = type.toLowerCase()
        // check if it's an object
        if (type === 'object')
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        // check if value is a valid (boolean, string, number)
        else if (typeof value === type)
            return true
        // check if value is a valid email
        else if (type === 'email')
            return validator.isEmail(value)
        //  check if value is a jwt
        else if (type === 'jwt')
            return validator.isJWT(value)
        // check if value is a valid mongodb id
        else if (type === 'mongoid') {
            return validator.isMongoId(value)
        }
        // check if value is a valid array
        else if (type === 'array')
            return Array.isArray(value)
        else
            return false
    }
}




const loginSchema = new Schema({
    email: {
        type: "email",
        required: true,
        whitespace: false,
        makeLower: true,
        toUpper: true,
        // modifyValue: (value) => value.toUpperCase(),
        validate(value) { },
        func: function (value, sucess, error) {
            // error is tid to this feild
            //    sucess true or false
        }
    },
    users: {
        type: "object",
        $_validateInside: true,
        required: false,
        $_data: {
            name: "string",
            age: "number",
            gender: {
                type: "string",
                required: true,
                enum: ["male", "female"],
                toLower: true
            }
        }
    },
    _id: {
        type: "mongoId",
        required: true
    },
    age: {
        type: "number",
        minValue: 18,
        required: true
    },
    stuffs: {
        type: "array",
        required: true,
        $_validateInside: true,
        $_data: [{
            name: {
                required: true,
                type: "object",
                $_validateInside: true,
                $_data: {
                    height: "number",
                    isDark: "boolean",
                    friends: {
                        type: "array",
                        required: true,
                        $_validateInside: true,
                        $_data: [{
                            name: {
                                type: "string",
                                required: true
                            },
                            age: "number",
                            isDark: "boolean"
                        }]
                    }
                }
            }
        }]
    }
}, {
    preventUnregisteredKeys: true
})


console.log(loginSchema.validate({
    email: "hartpaulisimo@gmail.com",
    // password: "123456789",
    users: {
        gender: "Female",
        name: "Paul"
    },
    _id: "6394e5d2efefd6b89f52afbc",
    age: 17,
    stuffs: [{
        name: {
            height: 4,
            isDark: true,
            friends: [{
                name: "mike",
                age: 59,
                isDark: false
            }, {
                name: "Samuel",
                age: 5,
                isDark: true
            }]
        }
    }]
}))







