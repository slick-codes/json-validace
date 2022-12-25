

```bash
# npm
npm install --save json-validace
# yarn 
npm yarn add json-validace 
```

### Usage & example

```javascript
const jsonValidace = require("json-validace")

// create a validace schema 
const loginSchema = new jsonValidace.Schema({
    password: {
        type: "string",
        required: true,
        minLength: 10,
        maxLength: 20
    },
    email: {
        type: "email",
        required: true
    }
})


```

```javascript
    // Useage
const result = loginSchema.validate({
    email: "test@gmail.com",
    password: "slickcodes"
})
```
```bash 
    {
        error: null,
        isValid: true,
        data: { email: 'test@gmail.com', password: 'slickcodes' }
    }
```
