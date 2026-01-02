function sayHi(){
    return function inner(){
    console.log('hi')
    }
}

const x = sayHi
console.log(x)