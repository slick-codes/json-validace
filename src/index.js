import validator from 'validator'

const Schema = class {
    constructor(schema, configuration) {
        this.schema = schema ?? {}
        this.nestedSchema = null
        this.supportedType = ["string", "number", "boolean", "email", "array", "object"]
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
            console.log(schemaKey)
            const dataValue = objectData[schemaKey]
            let schemaData = schema[schemaKey]

            // check if key only has a type declearation
            if (typeof schemaData === 'string')
                schemaData = { type: schemaData }


            // check if the schema key exist in the data
            const valueExist = Object.keys(objectData).includes(schemaKey)
            const isTypeSupported = this.supportedType.includes(schemaData.type)


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

            // validate nested schemas
            if (schemaData.type === 'object' &&
                schemaData.$_validateInside && dataValue) {
                this.nestedSchema = schemaData.$_data
                this.validate(dataValue)
                // this.nestedSchema = null
                // continue;
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
            if (schemaData.toLower)
                objectData[schemaKey] = objectData[shcemaKey].toLowerCase()
            else if (schemaData.toUpper)
                objectData[schemaKey] = objectData[schemaKey].toUpperCase()


            // Handle data modification (midifyValue) feild
            if (typeof schemaData.modifyValue === 'function')
                objectData[schemaKey] = schemaData.modifyValue(dataValue)

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
        // check if it's an object
        if (type === 'object')
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        // check if value is a valid (boolean, string, number)
        else if (typeof value === type)
            return true
        // check if value is a valid email
        else if (type === 'email')
            return validator.isEmail(value)
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
                enum: ["male", "female"]
            }
        }
    },
    age: {
        type: "number",
        minValue: 18,
        required: true
    }
}, {
    preventUnregisteredKeys: false
})


console.log(loginSchema.validate({
    email: "hartpaulisimo@gmail.com",
    password: "123456789",
    users: {
        gender: "male",
        name: "Paul"
    },
    age: 17
}))



// module.exports = {
//     Schema
// }






