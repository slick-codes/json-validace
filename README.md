
# Description
JSON validace (json-validace) is an open source schema base validator that allows developers validate json and javascript object using an itiutive object schema.

#### Why use json-validace

There are alot of schema base validator packages out there but only a few supports nested validation, outside nested validation json-validace also has lots of useful methods, modifiers, types and many more feautures.

  

# Installation

Just like any clasic npm package you can install json-validace using npm, yarn or any other installer you prefer.

```bash
# npm
npm install --save json-validace
```

```bash
# yarn 
yarn add json-validace 
```

# Usage & example

```javascript
// Filename: validace.schema.js
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

// export loginSchema
module.exports = loginSchema
```

```javascript
// Filename: test.js
cosnt { loginSchema } = require('validace.schema.js')

    // Useage
const result = loginSchema.validate({
    email: "test@gmail.com",
    password: "slickcodes"
})

// log result to console | terminal
console.log(result)
```

```bash
# Result: in ternimal | console
    {
        error: null,
        isValid: true,
        data: { email: 'test@gmail.com', password: 'slickcodes' }
    }
```

#### NOTE

if you're using <strong>REACT, VUE ,Svelte, Angular </strong> or other frontend framework you'll need to import using the import keyword.

```javascript
import { Schema } from "json-validace"
```
or
```javascript
import jsonValidace from "json-validace"
```

# Schema Properties & Methods
Properties & methods are the foundation of this library as they help specify the structure of the value expected. so far we have two types of Properties & methods namely Modifiers and Validators.

## <li>Validators</li>

<strong>Validators</strong> are basically properties that allows you setup your prefered structure for every key par value.
- type
- required
- minLength & maxLength 
- minNumber & maxNumber
- enum
- whitespace
- match
- validate
### Type
> <i><b>Default:</b> no default value </i>
> <i><b>NOTE:</b> this property is mandatory (required)</i>
> <i><b>Works with:</b> all types of data </i>
> <i><b>Usage</b>: type: "string"</i>

the Type property is the only required property in the schema, it states what type of data is expected.
The type property can be parsed as a property in the schema or directly.

```js
// parse type directly
const { Schema } = require('json-validace')

const loginSchema = new Schema({
    password: "string",
    email: "email"
})
```

```js
// parse type as a key 
const { Schema } = require('json-validace')

const loginSchema = new Schema({
    password:  { type: "string" },
    email: { type: "email" }
})
```

while declearing type directly can be simpler and easier to read, it doesnt allow you to parse in other keys, which is why it's good to set type as a key.

if the value parsed to the valdate method does not meet the type requirements the returned value will be populated with a type error.

#### examples

```javascript
const { Schema } = require('json-validace')

const loginSchema = new Schema({
    password: { type: "string" },
    email: { type: "email" }
})

// validate the login object
const validate = loginSchema.validate({
    email: "slickcodes@mail", // this should be an email
    password: 59489483 // this should be a valid string
})

console.log(validate)
```

```bash
# BASH : result
{
  error: {
    password: { type: ' "password" value is not a string' },
    email: { type: ' "email" value is not a email' }
  },
  isValid: false,
  data: null
}

```

To prevent error message like the one above we'll need to parse in the correct type.

#### Types table

| S/N | Types   | Example                                                                                                                                                                               | Description                                                                                                                                                                                                                                  |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | string  | Hello Word                                                                                                                                                                            | this is any sequence of character                                                                                                                                                                                                            |
| 2   | email   | test@gmail.com                                                                                                                                                                        | email is a sub-type of string, it detects if the parsed value is a valid email address                                                                                                                                                       |
| 3   | number  | 59                                                                                                                                                                                    | the number type checks if the parsed value is a valid number, NOTE: floats and any falsy or truty data are also considered as valid number.                                                                                                  |
| 4   | float   | 49.5                                                                                                                                                                                  | floats is a sub-type of number and it checks if the value parsed in is a valid floating point number.                                                                                                                                        |
| 5   | boolean | true                                                                                                                                                                                  | boolean is type checks if the parsed data is a valid boolean value, a good example can be using true, false or an expression like 59 > 3                                                                                                     |
| 6   | date    | 1997-10-17                                                                                                                                                                            | date is a sub-type of string and it checks if the parsed data is a valid date type, it uses the YYYY-MM-DD configuration and it will work with any javascript date object like the date number (1671987916618) or (2022-12-25T17:05:33.957Z) |
| 7   | array   | ["Paul", "Mike"]                                                                                                                                                                      | array checks if the parsed in value is a valid array, depending on your schema you can also validate the value if the array is an array of object.                                                                                           |
| 8   | object  | {author: "Paul"}                                                                                                                                                                      | object type check if the data parsed is a valid object literal                                                                                                                                                                               |
| 9   | jwt     | eyJhbGciOiJIUzI1NiIsInR5c<br>CI6IkpXVCJ9.eyJzdWIiOiI<br>xMjM0NTY3ODkwIiwibmFtZSI6 <br> IkpvaG4gRG9lIiwiaWF0Ij<br>oxNTE2MjM5MDIyfQ<br>.SflKxwRJSMeKKF2QT4fwp<br>MeJf36POk6yJV_adQssw5c | JWT (JSON Web Token) is a sub-type of string and it checks if the parsed string meets the JWT standard.                                                                                                                                      |
| 10  | mongoid | 507f191e810c19729de860ea                                                                                                                                                              | the mongoId type is a sub-type of string and it checks if the string provided is a valid mongoID.                                                                                                                                            |


### Required
> <i><b>Default:</b> required: false </i>
> <i><b>Works with:</b> all types of data </i>
> <i> <b>works with</b>: every type of data</i>
> <i><b>Usage</b>: required: true (required: boolean)</i>


when the <strong>required</strong> property takes in a boolean value, when this property is used, an error will be thrown if the parsed object does not have the key.

#### example

```javascript
const { Schema } = require("json-validace")
// registering the login schema
const signupSchema = new Schema({
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    surname: { type: "string", required: false },
    username: { type: "string", default: "anonymous" },
    dateOfBirth: { type: "date", required: false },
    gender: {
        type: "string",
        required: true,
    }
})
// validating the login object
const result = signupSchema.validate({})

console.log(result)
```

```bash 
# BASH: output
{
  error: {
    lastName: { required: '"lastName" feild is required!' },
    gender: { required: '"gender" feild is required!' }
  },
  isValid: false,
  data: null
}
```
the above code shows us what happens with a required value is not parsed in. An error was only generate for the lastName and gender key, and other keys passed the check even though they where not provided. the firstName did not generate any error because it was provided.

### Max Length & Min Length
> <i> <b>works with</b>: strings & arrays</i>
> <i><b>Usage</b>: maxLength: 30</i>
> <i><b>Usage</b>: minLength: 8</i>
> <i><b>Default</b>: maxLength: Infinity; minLength: Infinity</i>

The <strong>maxLength & minLength</strong> properties helps determin the length of the string or array provided.
if the length of the value provided exceeds the <strong>maxLength</strong> then you'll get an error and if it's below the <strong>minLength</strong> you'll get an error.

#### examples
```javascript 
const { Schema } = require("json-validace")

// registering the login schema
const loginSchema = new Schema({
    email: { type: "email", required: true },
    password: { type: "string", required: true, maxLength: 20, minLength: 8 }
})
// validating the login object
const result = loginSchema.validate({
    email: "test@gmail.com",
    password: "food" // length = 4
})
console.log(result)

```
```bash 
# BASH: output
{
  error: {
    password: { minLength: 'password should be 8 characters or above' }
  },
  isValid: false,
  data: null
}
```
The above code generated an error because the password did not meet the minLength requirement of 8 characters or below.


```javascript 
const { Schema } = require("./src")

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
// validating the login object
const result = studentSchema.validate({
    name: "John Doe",
    id: 4934,
    essey: "Introduction: Exercise is an essential part of a healthy lifestyle, and it offers numerous physical and mental benefits. Studies have shown that regular exercise can help reduce the risk of chronic",
    hobbies: ["Football", "Video Games", "Coding", "Dancing"]
})
console.log(result)

```


```bash
# BASH: Output
{
  error: {
    essey: { minLength: 'essey should be 500 characters or above' },
    hobbies: { minLength: ' hobbies should be 3 items or below. ' }
  },
  isValid: false,
  data: null
}
```
the above code shows you how the minLength can also be used on arrays.

### Enum
> <i><b>Default:</b> no default value </i>
> <i><b>Works with:</b> Boolean, Strings, JWT, mongoId, Number, Floats</i>
> <i><b>NOTE:</b> this will not work with arrays object and date</i>
> <i><b>Usage</b>: enum: ["rice", "mike", 4, true]</i>

<strong>Enum</strong> ensures the provided value exist within a range of values. i found that this is useful when you want to specify things like the gender of a person.

#### examples
```javascript
const { Schema } = require("./src")

const studentSchema = new Schema({
    name: { type: "string", required: true },
    id: { type: "number", required: true },
    favColor: {
        type: "string",
        enum: ["red", "green", "blue", "purple"]
    }
})
// validating the login object
const result = studentSchema.validate({
    name: "John Doe",
    id: 4934,
    favColor: "white"
})
console.log(result)

```
```bash 
# BASH: Output
{
  error: {
    favColor: {
      enum: ' favColor should be an enum of (red | green | blue | purple)'
    }
  },
  isValid: false,
  data: null
}

```

### maxNumber & minNumber 
> <i><b>Default:</b> no default value </i>
> <i><b>Works with:</b> Numbers and floats</i> 
> <i><b>Usage</b>: maxNumber: 20</i>
> <i><b>Usage</b>: minNumber: 10</i>

 <b>maxNumber and minNumber</b> are used to specify the number range allowed and will return an error if provided value does not meet the range, this is expecially useful when specifying age.

```javascript

const { Schema } = require("./src")

const ageRange = new Schema({
    age: {
        type: "number",
        required: true,
        minNumber: 18,
        maxNumber: 40
    }
})


console.log(ageRange.validate({ age: 30 }))
console.log(ageRange.validate({ age: 10 }))
console.log(ageRange.validate({ age: 44 }))
console.log(ageRange.validate({ age: 18 }))

```

```bash
# BASH: Output
{ error: null, isValid: true, data: { age: 30 } }
{
  error: { age: { maxNumber: ' age is lower than 18' } },
  isValid: false,
  data: null
}
{
  error: { age: { minNumber: 'age is higher than 40' } },
  isValid: false,
  data: null
}
{ error: null, isValid: true, data: { age: 18 } }
```
###whitespace
> <div><i><b>Type:</b> Property</div>
> <div><i><b>Default:</b> whitespace: true </i></div>
> <div><i><b>Works with:</b> string, email,jwt,mongoid</i></div>
> <div><i><b>Usage</b>: whitespace: true</i></div>

<strong>whitespace</strong> returns an error if the provided string contains a space this is useful if you dont want text to be inside of a feild for example, the clasic username structure does not expect a space between it.

####examples

```javascript 
const { Schema } = require('json-validace')


const login = new Schema({
    username: {
        type: "string",
        required: true,
        whitespace: false
    },
    password: {
        type: "string",
        required: true
    }
})

const result = login.validate({
    username: "slick codes",
    password: "somesortofpassword"
})

console.log(result)
```

```bash
# bash: Output
{
  error: { username: { whitespace: 'username should have no whitespace' } },
  isValid: false,
  data: null
}
```

### Match
<strong>match</strong> is great if you want to match a provided string against a regular expression. if the porvided string does not match the regular expression then it will return an error.
> <div><i><b>Type:</b> Property</div>
> <div><i><b>Default:</b> no default value </i></div>
> <div><i><b>Works with:</b> string, email,jwt,mongoid</i></div>
> <div><i><b>Usage:</b> match: /^(?=.*[A-Za-z])(?=.*\d)[?=.*[@$!%*#?&]](A-Za-z\d@$!%*#?&){8,}$/</i></div>


```javascript
const { Schema } = require('json-validace')


const login = new Schema({
    username: {
        type: "string",
        required: true,
        whitespace: false
    },
    password: {
        type: "string",
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    }
})

const result = login.validate({
    username: "slickcodes",
    password: "slick"
})

console.log(result)
```
```bash
# BASH: Output
{
  error: { password: { match: '"slick" does not match the regex' } },
  isValid: false,
  data: null
}
```
### validate
> <div><i><b>Type:</b> Method</div>
> <div><i><b>Default:</b> no default value </i></div>
> <div><i><b>Works with:</b> nothing </i></div>
> <div><i><b>Usage:</b> validate( value ){
>   <div> 
>       // some sort of condition
>   <div>return {isValid: false, errMessage: "custom error message"}</div>
>  </div>
> }</i></div>
>

You can write your own validation using the validate method, the method takes in the value parsed in as a parameter and return an object containing an optional error message.

```javascript 
const { Schema } = require('json-validace')


const login = new Schema({
    username: {
        type: "string",
        required: true,
        whitespace: false,
        validate(value) {
            if (value.length > 10) {
                return { isValid: true }
            } else {
                return { isValid: false, errMessage: "your text is too short" }
            }
        }
    },
    password: {
        type: "string",
        required: true
    }
})

const result = login.validate({
    username: "slickcodes",
    password: "slick"
})

console.log(result)
```
```bash
# BASH: Output 
{
  error: { username: { validate: 'your text is too short' } },
  isValid: false,
  data: null
}
```
The code above checks if the value provided is hiegher than 10, since validate is a function the possiblities are basically endless. 
set the isValid porperty to true when if the validation is correct, and the opposite is the case if it's false however you can add an additional errMessage property which will act as a custom error message.
## <li>Modifiers</li>

<strong>Modifiers</strong> allow you to make changes to the value parsed, examples of Modifiers.

<!-- - func -->
<!-- trim -->
- toLower
- toUpper
- default
- trim , trimLeft, trimRight
- modifyValue
### toLower & toUpper
> <i><b>Default:</b> no default value </i>
> <i><b>Works with:</b> Boolean, Strings, JWT, mongoId, Number, Floats</i>
> <i><b>NOTE:</b> this will not work with arrays object and date</i>
> <i><b>Usage</b>: toLower: true</i>

the toLower is used to convert the provided text to lowercase while the toUpper transforms the provided text to uppercase. unlike the maxLength and minLength, the toLower and toUpper cannot be used together on a single key, only one can be used at a time.

```javascript

const { Schema } = require("./src")

const email = new Schema({
    email: {
        type: "email",
        required: true,
        toLower: true
    },
    username: {
        type: "string",
        required: true,
        toUpper: true
    }
})

const result = email.validate({
    email: "TEST@GMAIL.COM",
    "slickcodes"
})

console.log(result)

```

```bash
# BASH: Output
{ error: null, isValid: true, data: { email: 'test@gmail.com', username: "SLICKCODES" } }
```

The above code show how the provided values will change. 
> <b>NOTE</b>: the change happens before any kind of validation 


## Default
the <b>default</b> property sets a value if a value is not provided. this also means that it will not return an error even if it's required, rather it will populate the key with a value.

```javascript
const { Schema } = require("./src")

const detailSchema = new Schema({
    email: {
        type: "email",
        required: true,
        toLower: true
    },
    username: {
        type: "string",
        default: "anonymous"
    }
})

const result = detailSchema.validate({
    email: "TEST@GMAIL.COM"
})


console.log(result)

```

```bash
# BASH: Output
{
  error: null,
  isValid: true,
  data: { email: 'test@gmail.com', username: 'anonymous' }
}
```

## trim, trimLeft, trimRight

trim is used to remove extra space around text, this works like the trim method in javascript, however this is a porperty that takes in a boolean, when it's set to true it removes the spaces and when it's set to false it ignores it. 
The Trim porperty by default removes space at the left and right side of a text (string) however you can also use the trimLeft, and a trimRight to specify the direction you want to trim.

### examples


```javascript
const { Schema } = require('./src/')


const login = new Schema({
    username: {
        type: "string",
        required: true,
        whitespace: false,
        trim: true
    },
    password: {
        type: "string",
        required: true
    }
})

const result = login.validate({
    username: " slickcodes    ",
    password: "slick"
})

console.log(result)
```

```BASH 
# BASH: Output
{
  error: null,
  isValid: true,
  data: { username: 'slickcodes', password: 'slick' }
}
```

Notice how the data is valid even though there was too much space, this is because the extra space where removed with trim before the whitespace check, this will be different if the space was between texts.

### modifyValue 

The modifyValue method allows you to dynamically modify a value on like other modifiers, modifyValue is a method which means you can write complex expressions and then assign a value to the key.

#### examples

```javascript 
const { Schema } = require('./src/')


const login = new Schema({
    username: {
        type: "string",
        required: true,
        modifyValue: (value) => value.split(' ').join('-')
    },
    password: {
        type: "string",
        required: true
    }
})

const result = login.validate({
    username: "slick codes",
    password: "slick"
})

console.log(result)

```

```bash
# BASH: Output
{
  error: null,
  isValid: true,
  data: { username: 'slick-codes', password: 'slick' }
}
```

Notice how the username changed to slick-codes even though the original entry was slickcodes? well this is the flexibility of the modifyValue method.

## func 
The func method is neigther a validator or a modifyer since it does not requires a return startment. however the func method is a very useful method that allows you write additional functionalities, this method is expected to return nothing, but it takes in a data parameter which is an object containing the value,key,isValid,error (error associated with the key), allErrors,errMessages (associated with the key) and a few others.

this is increadibly useful if you want to update the message on your browser or even console for nodejs users.

```html
<!-- Svelte -->
 <script>
 </script>

<div>
</div>

<style>
</style>

```
above is a Sveltejs scarfold, the following codes is going to be a complete form created using svelte, and of course the json-validace package.

```javascript
// <script></script>
  import { Schema } from "json-validace";

  // hold data from the error box in the DOM
  let errorMessage = {};

// the value of the input a bind to this variables
  let emailValue = "";
  let passwordValue = "";

  // create my func function
// this method will output an error to the DOM
  function outputError(data) {
    errorMessage[data.key] = data.errorMessages[0] || "✔️";
  }

  const loginSchema = new Schema({
    email: {
      type: "email",
      required: [true, "%key% cannot be empty!"], // assigning a custom error using  porperty: [value, custom erorr]
      func: outputError // attaching outputERror to func in the email param
    },
    password: {
      type: "string",
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "%key% is too weak!" // custom error message for the match property
      ],
      func: outputError // attaching outputError to fun in the passsword param
    }
  });

  // convert "" empty string to undefined to trigger the required erorr, since it only works when there's no value
  const filterString = string => (string.trim() === "" ? undefined : string);

  // Submit function
  function submit() {
    const result = loginSchema.validate({
      email: filterString(emailValue.value), //this will triger the required error if there's no value, since required considers an empty string a value
      password: filterString(passwordValue.value)
    });
    
    if (!result.isValid) return event.preventDefault();

    // .. submition code here
  }

```

The code above is the javascript code and it should be within the <script></script> tag.

```html
<!-- html -->
<div class="container">
    <div class="wrapper">
        <header>
            <h1>Login</h1>
            <p>Login to your account</p>
        </header>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <form action="" on:submit|preventDefault={ submit }>
            <input type="text" placeholder="Email" bind:this={emailValue} />
            <div class="message" class:disable={!errorMessage.password}>{errorMessage.email}</div>
            <section>
                <input type={ show? 'text' : 'password' } placeholder="Password" bind:this={passwordValue} />
                <span class="icon" on:click={ () => show = !show}>
                    <Icon {show} />
                </span>
            </section>
            <div class="message" class:disable={!errorMessage.password}>{errorMessage.password}</div>
            <button>Login</button>
            <a href=".">Forgotten Password?</a>
        </form>
    </div>
</div>
```
```css
/* importing font */
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

  /* global tergetting unique to svelte */
  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .disable {
    opacity: 0;
  }
  button:active {
    background: #25074c !important;
  }
  a {
    padding-top: 0.8em;
  }
  .message {
    font-size: 0.77rem;
  }

  .container {
    background-color: #360970;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Roboto", sans-serif;
  }

  .container .wrapper {
    background-color: white;
    width: 30rem;
    padding: 4rem 2rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .container .wrapper header p {
    color: #7c7c7c;
    font-size: 0.9rem;
  }

  .container .wrapper form {
    display: flex;
    flex-direction: column;
    /* gap: .5rem; */
  }

  .container .wrapper form section {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-flow: column;
    width: 100%;
  }

  form .message {
    padding: 0.5em 0;
    height: 1em;
    padding-bottom: 2.5em;
  }

  .container .wrapper form section input {
    width: 100%;
  }

  .container .wrapper form section .icon {
    /* justify-self: center; */
    position: sticky;
    position: absolute;
    right: 0;
    top: 30%;
    transform: translate(-0.5rem);
    cursor: pointer;
  }

  .container .wrapper form input {
    padding: 1rem;
    border: 1px solid #7c7c7c;
    width: 100%;
  }

  .container .wrapper form input:focus {
    outline: 1px solid #360970;
  }

  .container .wrapper form button {
    color: white;
    background-color: #360970;
    border: none;
    padding: 1rem;
  }

  .container .wrapper form a {
    color: #360970;
    font-size: 0.9rem;
    text-decoration: none;
  }

```

the form generated by the above code is completely validated with json-validace and it shows how useful the func method is.