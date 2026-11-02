//  Classes - which substantially simplifies the definition of classes (or class-like things) in JavaScript.

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    };

    greet() {
        console.log(`Hello ${this.name}, Welcome to React World`);
    };

    ageVerification() {
        if (this.age >= 18) {
            console.log(`Welcome ${this.name}, Your age is ${this.age} you are eligible !!`);
        }
    };
};

const user1 = new Person("Vinayak", 24);
user1.greet()