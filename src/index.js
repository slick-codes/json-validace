const validator = require('validator')

const Schema = class {
    constructor(schema, configuration) {
        this.schema = schema ?? {}
        this.nestedSchema = null
        this.error = {}
        this.nestedError = undefined
        this.key = undefined
        this.supportedType = [
            "string",
            "number",
            "boolean",
            "array",
            "object",
            "email",
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
        const schema = this.nestedSchema ?? this.schema
        const error = this.nestedError ?? this.error

        const schemaKeys = Object.keys(schema)

        // Prevent users from using more keys than the Schema allows
        if (this.config.preventUnregisteredKeys)
            Object.keys(objectData).forEach(key => {
                if (!schemaKeys.includes(key))
                    throw new Error(`ValidaceError: "${key}" is not registered in the schema!`)
            })

        for (let schemaKey of schemaKeys) {
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


            // validate nested obj schemas
            if (schemaData.type === 'object' &&
                schemaData.$_data && dataValue) {
                this.nestedSchema = schemaData.$_data
                this.key = schemaKey
                this.validate(dataValue)
                this.nestedSchema = null
            }
            // validate nested array of object schema
            if (schemaData.type === "array" && schemaData.$_data) {
                if (!Array.isArray(schemaData.$_data))
                    throw new Error('$_data should be an array with object')

                for (let object of dataValue) {
                    this.nestedSchema = schemaData.$_data[0]
                    this.key = schemaKey
                    this.validate(object)
                    this.nestedSchema = null
                    this.key = undefined
                    // continue
                }

            }

            // handle default 
            if (schemaData.default && !dataValue)
                objectData[schemaKey] = schemaData.default

            // Handle Required feild
            if (schemaData.required && !objectData[schemaKey])
                this.#setError(schemaKey, { // error handling on the required key!
                    [schemaKey]: {
                        required: `${schemaKey} feild is required!`,
                        messages: [schemaKey].message ? [schemaKey.message].push(`${schemaKey} feild is required!`) : [`${schemaKey} feild is required!`]
                    }
                })

            // Handle minLength && maxLength
            if (schemaData.minLength && dataValue.length < schemaData.minLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.minLength} characters and above`)
            if (schemaData.maxLength && dataValue.length > schemaData.maxLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.maxLength} characters and below. `)

            // validate minValue and maxValue
            if (schemaData.minNumber && dataValue > schemaData.maxNumber)
                throw new Error(`ValidaceError: ${schemaKey} is higher than ${schemaData.maxNumber}`)
            if (schemaData.maxNumber && dataValue < schemaData.minNumber)
                throw new Error(`ValidaceError: ${schemaKey} is lower than ${schemaData.minNumber}`)
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

            // Handle validate function
            if (typeof schemaData.validate === 'function')
                schemaData.validate(dataValue)
        }

        this.nestedSchema = null

        return {
            error: this.error,
            isValid: Object.keys(this.error).length === 0,
            data: objectData
        }
    }

    #setError(key, object, error) {
        if (this.nestedSchema)
            this.error = { ...this.error, [this.key]: object }
        else
            this.error = { ...this.error, ...object }
    }

    #typeValidation(type, value) {
        type = type.toLowerCase()
        // check if it's an object
        if (type === 'object')
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        // check if value is a valid (boolean, string, number)
        else if (typeof value === type)
            return true
        // check if value is a valid array
        else if (type === 'array')
            return Array.isArray(value)
        // check if value is a valid email
        else if (type === 'email')
            return validator.isEmail(value)
        //  check if value is a jwt
        else if (type === 'jwt')
            return validator.isJWT(value)
        // check if value is a valid mongodb id
        else if (type === 'mongoid') {
            return validator.isMongoId(String(value))
        }
        else
            return false
    }
}



exports.default = { Schema };
module.exports = exports.default;
module.exports.default = exports.default;