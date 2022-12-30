const validator = require('validator')

/**
 * @param   {schema} schema  the 
 * @returns instance of Schema
 */
const Schema = class {
    constructor(schema, configuration) {
        this.schema = schema ?? {}
        this.nestedSchema = null
        this.error = {}
        this.supportedType = [
            "string",
            "number",
            "float",
            "boolean",
            "array",
            "object",
            "email",
            "date",
            "jwt",
            "mongoid"
        ]
        this.config = configuration ?? {
            // default configuration
            preventUnregisteredKeys: true
        }
    }
    #setPlaceholder(string, placeholder) {
        return string.replace(/%value%/g, placeholder.value || "")
            .replace(/%key%/g, placeholder.key)
            .replace(/%property%/g, placeholder.property)
    }

    #createErrorObject(customError, value, property, key, schema) {
        return {
            ...customError,
            [`${property}Error`]: this.#setPlaceholder(schema[property][1], {
                value,
                property,
                key
            })
        }
    }
    /***
     * @param {object} objectData this is a key pair value that will be validated 
     * @param {function} callback an optional callback function 
     */
    validate(objectData, callback) {

        const schema = this.nestedSchema ?? this.schema
        let error = {}

        const schemaKeys = Object.keys(schema)

        // Prevent users from using more keys than the Schema allows
        if (this.config.preventUnregisteredKeys)
            Object.keys(objectData).forEach(key => {
                if (!schemaKeys.includes(key))
                    error = this.#setError(key, error, { // error handling
                        unRegisteredKey: `  "${key}" is not registered on the schema!`,
                    })
            })

        for (let schemaKey of schemaKeys) {
            const dataValue = objectData[schemaKey]
            let schemaData = schema[schemaKey]

            const setPlaceholder = (string, property) => {
                return string.replace(/%value%/g, objectData[schemaKey])
                    .replace(/%key%/g, schemaKey)
                    .replace(/%property%/g, property)
            }

            // set key to object if type is set directly
            if (typeof schemaData === 'string' || Array.isArray(schemaData))
                schemaData = { type: schemaData }

            // customError
            let customError = {}

            // dynamically assign custom error to customError object
            Object.keys(schemaData).forEach(property => {
                if (
                    (Array.isArray(schemaData[property]) && property !== 'enum') ||
                    (property === 'enum' && Array.isArray(schemaData[property][0]))
                ) {
                    customError = this.#createErrorObject(customError, dataValue, property, schemaKey, schemaData)
                    schemaData[property] = schemaData[property][0]
                }
            })

            // check if schema has type 
            if (!schemaData.type)
                error = this.#setError(schemaKey, error, { // error handling
                    type: customError.typeError ? customError.typeError : `"${schemaKey}" value is not a supported ${schemaData.type ?? 'datatype'}`,
                })

            // check if the schema key exist in the data
            const valueExist = Object.keys(objectData).includes(schemaKey)
            const isTypeSupported = this.supportedType.includes(schemaData.type?.toLowerCase())

            // Handle Type
            if (isTypeSupported) {
                if (!Array.isArray(schemaData.type)) {
                    const typeCheck = this.#typeValidation(schemaData.type, dataValue)
                    if (!typeCheck && valueExist)
                        error = this.#setError(schemaKey, error, { // error handling
                            type: customError.typeError ? customError.typeError : ` "${schemaKey}" value is not a ${schemaData.type ?? 'datatype'}`,
                        })
                }
            } else if (typeof schemaData !== 'string') {
                error = this.#setError(schemaKey, error, { // error handling
                    type: customError.typeError ? customError.typeError : `  Syntax Error ~ type is not decleared on "${schemaKey}" property`,
                })
            }
            else {
                error = this.#setError(schemaKey, error, { // error handling
                    type: customError.typeError ? customError.typeError : `  Syntax Error ~ "${schemaData.type}" is not a valid type`,
                })
            }

            // validate nested obj schemas
            if (schemaData.type === 'object' &&
                schemaData.$_data && dataValue) {
                this.nestedSchema = schemaData.$_data
                const result = this.validate(dataValue)
                if (Object.keys(result.error).length > 0) {
                    error = { ...error, [schemaKey]: { ...result.error } }
                }
                this.nestedSchema = null
            }
            // validate nested array of object schema
            if (schemaData.type === "array" && schemaData.$_data) {
                if (!Array.isArray(schemaData.$_data))
                    error = this.#setError(schemaKey, error, { // error handling
                        type: ustomError.typeError ? customError.typeError : ` Schema key: "${schemaKey}" $_data is not a supported ${schemaData.type ?? 'datatype'}`,
                    })

                if (!Array.isArray(dataValue)) {
                    error = this.#setError(schemaKey, error, { // error handling
                        type: ustomError.typeError ? customError.typeError : ` "${schemaKey}" should be an array of object`,
                    })
                } else for (let object of dataValue) {
                    this.nestedSchema = schemaData.$_data[0]
                    const result = this.validate(object)
                    if (Object.keys(result.error).length > 0) {
                        error = { ...error, [schemaKey]: [result.error] }
                    }
                    this.nestedSchema = null
                }

            }

            // check for whitespace error
            if (schemaData.whitespace === false &&
                dataValue &&
                objectData[schemaKey].split(' ').length > 1)
                error = this.#setError(schemaKey, error, {
                    whitespace: customError.whitespaceError ? customError.whitespaceError : `${schemaKey} should have no whitespace`
                })

            // handle default 
            if (schemaData.default && !dataValue)
                objectData[schemaKey] = schemaData.default

            // Handle Required feild
            if (schemaData.required && !objectData[schemaKey])
                error = this.#setError(schemaKey, error, { // error handling
                    required: customError.requiredError ? customError.requiredError : `"${schemaKey}" feild is required!`,
                })

            // Handle minLength && maxLength
            if (schemaData.minLength && dataValue?.length < schemaData.minLength)
                error = this.#setError(schemaKey, error, { // error handling
                    minLength: `${schemaKey} should be ${schemaData.minLength} ${schemaData.type === 'array' ? 'items' : "characters"} or above`
                })
            // Handle maxLength
            if (schemaData.maxLength && dataValue?.length > schemaData.maxLength)
                error = this.#setError(schemaKey, error, { // error handling
                    minLength: ` ${schemaKey} should be ${schemaData.maxLength} ${schemaData.type === 'array' ? 'items' : "characters"} or below. `
                })

            // validate minValue and maxValue
            if (schemaData.minNumber && dataValue > schemaData.maxNumber)
                error = this.#setError(schemaKey, error, { // error handling
                    minNumber: `${schemaKey} is higher than ${schemaData.maxNumber}`
                })
            if (schemaData.maxNumber && dataValue < schemaData.minNumber)
                error = this.#setError(schemaKey, error, { // error handling
                    maxNumber: ` ${schemaKey} is lower than ${schemaData.minNumber}`
                })

            // Handle: cases lower and upper
            if (schemaData.toLower && schemaData.type == 'string') {
                objectData[schemaKey] = objectData[schemaKey].toLowerCase()
            }
            else if (schemaData.toUpper && schemaData.type == 'string')
                objectData[schemaKey] = objectData[schemaKey].toUpperCase()

            // trim text
            if (dataValue && schemaData.type === 'string' && schemaData.trim) {
                objectData[schemaKey] = objectData[schemaKey].trim()
            }
            // trim text
            if (dataValue && schemaData.type === 'string' && schemaData.trimLeft) {
                objectData[schemaKey] = objectData[schemaKey].trimLeft()
            }
            // trim text
            if (dataValue && schemaData.type === 'string' && schemaData.trimRight) {
                objectData[schemaKey] = objectData[schemaKey].trimRight()
            }
            // check if value matches regular expression
            if (schemaData.regEx && schemaData.type === "string" && !schemaData.regEx.test(objectData[schemaKey]))
                error = this.#setError(schemaKey, error, {
                    whitespace: customError.whitespaceError ? customError.whitespaceError : `"${dataValue}" does not match the regex`
                })

            // Handle data modification (midifyValue) feild
            if (typeof schemaData.modifyValue === 'function')
                objectData[schemaKey] = schemaData.modifyValue(dataValue)


            // Handle: Enum
            if (schemaData.enum && !Array.isArray(schemaData.enum))
                error = this.#setError(schemaKey, error, { // error handling
                    enum: customError.enumError ? customError.enumError : `SchemaError: should be an array`
                })
            else if (schemaData.enum && !schemaData.enum.includes(objectData[schemaKey]))
                error = this.#setError(schemaKey, error, { // error handling
                    enum: customError.enumError ? customError.enumError : ` ${schemaKey} should be an enum of (${schemaData.enum.join(' | ')})`
                })




            // Handle validate function
            if (typeof schemaData.validate === 'function') {
                const result = schemaData.validate(dataValue)
                if (!result.isValid) {
                    error = this.#setError(schemaKey, error, {// error handling 
                        validate: result.errMessage ? setPlaceholder(result.errMessage, 'validate') : `validate method error!`
                    })
                }
            }

            try {
                if (typeof schemaData.func === 'function') {
                    schemaData.func(error[schemaKey], objectData[schemaKey], Object.keys(error).length === 0)
                }

            } catch (err) {
                error = this.#setError(schemaKey, error, { // error handling
                    func: "something went wrong!" + err
                })
            }

        }


        this.nestedSchema = null
        this.error = {}
        if (typeof callback === 'function')
            return callback(
                Object.keys(error).length === 0 ? null : error,
                Object.keys(error).length === 0,
                Object.keys(error).length === 0 ? objectData : null)
        else
            return {
                error: Object.keys(error).length === 0 ? null : error,
                isValid: Object.keys(error).length === 0,
                data: Object.keys(error).length === 0 ? objectData : null
            }
    }

    #setError(key, error, newError) {
        this.error = error[key] ? { ...error, [key]: { ...error[key], ...newError } } : { ...error, [key]: newError }
        return this.error
    }

    #isDate(value) {
        const result = String(new Date(value))
        return result === 'Invalid Date' ? false : true
    }

    #isFloat(value) {
        return Number(value) === value && value % 1 !== 0;
    }

    #typeValidation(type, value) {
        type = type.toLowerCase()
        // check if it's an object
        if (type === 'object')
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        // check if value is a valid (boolean, string, number)
        else if (typeof value === type)
            return true
        else if (type === 'date')
            return this.#isDate(value)
        else if (type === 'float')
            return this.#isFloat(value)
        // check if value is a valid array
        else if (type === 'array')
            return Array.isArray(value)
        // check if value is a valid email
        else if (type === 'email')
            return validator.isEmail(value ? value : "")
        //  check if value is a jwt
        else if (type === 'jwt')
            return validator.isJWT(value ? value : "")
        // check if value is a valid mongodb id
        else if (type === 'mongoid') {
            return validator.isMongoId(String(value ? value : ""))
        }
        else
            return false
    }
}



exports.default = { Schema };
module.exports = exports.default;
module.exports.default = exports.default;