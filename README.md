# ES6 JavaScript Concepts Explained

A simple guide to some of the most common and useful features introduced in ES6 (ECMAScript 2015).

---

## 1. What is the difference between `var`, `let`, and `const`?

Think of these as three ways to declare a storage box (a variable) for your data. They differ in their rules about where you can use them and if you can change what's inside.

* **`var` (The Old Way)**: This is the oldest keyword. It has **function scope**, meaning it's only truly contained inside a function. If you declare it outside a function, it becomes a global variable, which can cause bugs. You can re-declare and update a `var` variable anytime. It's very flexible, but sometimes *too* flexible.
    ```javascript
    var name = "Alice";
    var name = "Bob"; // No problem, you can re-declare
    name = "Charlie"; // And you can update it
    console.log(name); // "Charlie"
    ```

* **`let` (The New, Flexible Way)**: This is the modern replacement for `var` in most cases. It has **block scope**, which means it's confined to the nearest set of curly braces `{...}` (like in an `if` statement or a `for` loop). You can update its value, but you **cannot** re-declare it in the same scope.
    ```javascript
    let age = 30;
    // let age = 31; // Error! You can't re-declare 'age'
    age = 31; // This is fine, you're just updating the value
    console.log(age); // 31
    ```

* **`const` (The New, Strict Way)**: This also has **block scope**. Use `const` when you know the value should **never change**. Once you assign a value, you can't re-assign it. This helps prevent accidentally changing things that should stay constant. 📜
    ```javascript
    const birthYear = 1990;
    // birthYear = 1991; // Error! You can't change a constant
    ```
    **Quick Tip:** With `const` objects and arrays, you can still change their *contents*, you just can't re-assign them to a completely new object or array.

**In short:** Use `const` by default. If you know you'll need to re-assign the variable, use `let`. Try to avoid using `var` in modern JavaScript.

---

## 2. What is the difference between `map()`, `forEach()`, and `filter()`?

These are all handy tools for working with arrays, but they have different jobs. Imagine you have an array of numbers: `[1, 2, 3, 4]`.

* **`forEach()` (Just Do It)**: This method simply loops through every single item in an array and performs an action. It **does not return anything**. It's like walking down a line of people and telling each one to wave. You're not creating a new line of people; you're just making the existing ones do something.
    ```javascript
    const numbers = [1, 2, 3];
    numbers.forEach(num => {
      console.log(`The number is ${num}`); // Just performs an action
    });
    // It doesn't return a new array.
    ```

* **`map()` (Transform It)**: This method loops through an array, *transforms* each item based on a function you provide, and then **returns a new array** with the transformed items. The new array will always have the same length as the original. 🗺️
    ```javascript
    const numbers = [1, 2, 3];
    const doubledNumbers = numbers.map(num => num * 2);

    console.log(doubledNumbers); // [2, 4, 6] -> A new, transformed array!
    console.log(numbers);       // [1, 2, 3] -> The original is unchanged.
    ```

* **`filter()` (Select It)**: This method loops through an array and tests each item against a condition. It **returns a new array** containing *only* the items that passed the test. The new array can be shorter than the original. 🔍
    ```javascript
    const numbers = [1, 2, 3, 4, 5];
    const evenNumbers = numbers.filter(num => num % 2 === 0);

    console.log(evenNumbers); // [2, 4] -> A new array with only the passing items.
    console.log(numbers);     // [1, 2, 3, 4, 5] -> The original is unchanged.
    ```

**Summary**:
* `forEach()`: To do something with each item. Returns nothing.
* `map()`: To create a new array by transforming each item.
* `filter()`: To create a new, smaller array by selecting specific items.

---

## 3. What are arrow functions in ES6?

Arrow functions are a shorter, cleaner way to write functions in JavaScript. They're one of the most popular features of ES6.

Here's a traditional function:
```javascript
function add(a, b) {
  return a + b;
}