// Objects
// We can assign methods to an object by defining properties that are functions:
const arto = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',

    greet: function () {
        console.log('hello, my name is ' + this.name)
    },

    doAddition: function (a, b) {
        console.log(a + b);
    },

}
arto.greet();


// Methods can be assigned to objects even after the creation of the object:
arto.growOlder = function () {
    this.age += 1
};
console.log(arto.age); //35

arto.growOlder();
console.log(arto.age); //36


// Let's slightly modify the object:
arto.doAddition(1, 4);
const referenceToAddition = arto.doAddition;
referenceToAddition(10, 50)

// If we try to do the same with the method greet we run into an issue:
const referenceToGreet = arto.greet;

referenceToGreet()

/* 
    
    * When "calling the method through a reference", the method loses knowledge of what the original "this" was;

        # Contrary to other languages, in JavaScript the value of this is defined based on how the method is called. 

        # When calling the method through a reference, the value of this becomes the so-called global object.

        #  the end result is often not what the software developer had originally intended.

        # One situation leading to the "disappearance" of this arises when we set a timeout to call the greet function on the arto object, using the "setTimeout function."
    *
*/

setTimeout(arto.greet, 1000);

/* 

    # As mentioned, the value of this in JavaScript is defined based on how the method is being called.

    # When "setTimeout is calling the method", it is the JavaScript engine that actually calls the method and, at that point, "this refers to the global object".

    # There are several mechanisms by which the original this can be preserved. One of these is using a method called ** bind **:

*/

setTimeout(arto.greet.bind(arto), 1500);
// Calling arto.greet.bind(arto) creates a new function where this is bound to point to Arto.

