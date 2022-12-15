
const Schema = class {
    constructor(schema, configuration) {
        this.schema = schema ?? {}
        this.config = configuration ?? {
            // default configuration
            preventUnregisteredKeys: true
        }
    }

    validate(objectData) {
        const validData = {}
        const error = {}

        const schemaKeys = Object.keys(this.schema)

        // Prevent users from using more keys than the Schema allows
        if (this.config.preventUnregisteredKeys)
            Object.keys(objectData).forEach(key => {
                if (!schemaKeys.includes(key))
                    throw new Error(`ValidaceError: "${key}" is not registered in the schema!`)
            })

        for (let schemaKey of schemaKeys) {
            const schemaData = this.schema[schemaKey]
            const dataValue = objectData[schemaKey]

            // Handle Type
            if (!Array.isArray(schemaData.type)) {
                console.log(Schema.Email === schemaData.type)
            }

            // Handle Required feild
            if (schemaData.required && !dataValue)
                throw new Error(`ValidaceError: "${schemaKey}" feild is required!`)

            // Handle minLength && maxLength
            if (schemaData.minLength && dataValue.length < schemaData.minLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.minLength} characters and above`)
            else if (schemaData.maxLength && dataValue.length > schemaData.maxLength)
                throw new Error(`ValidaceError: ${schemaKey} should be ${schemaData.maxLength} characters and below. `)

            // Handle data modification (midifyValue) feild
            if (typeof schemaData.modifyValue === 'function')
                objectData[schemaKey] = schemaData.modifyValue(dataValue)

            // Handle validate function
            if (typeof schemaData.validate === 'function')
                schemaData.validate(dataValue)
        }

        return {
            error: error,
            isValid: Object.keys(error).length === 0,
            data: objectData
        }
    }

    static Email() { }
    static Phone() { }
    static MongodbId() { }
    static JWT() { }
}



module.exports = {
    Schema
}






