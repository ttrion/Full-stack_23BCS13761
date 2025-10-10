class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

class Student extends Person {
    constructor(name, age, studentId, course) {
        super(name, age);
        this.studentId = studentId;
        this.course = course;
    }

    greet() {
        return `${super.greet()} I am a student taking ${this.course}.`; // Method overriding
    }

    study() {
        return `${this.name} (ID: ${this.studentId}) is studying.`;
    }
}

class Teacher extends Person {
    constructor(name, age, employeeId, subject) {
        super(name, age);
        this.employeeId = employeeId;
        this.subject = subject;
    }

    greet() {
        return `${super.greet()} I teach ${this.subject}.`; // Method overriding
    }

    teach() {
        return `${this.name} (Emp ID: ${this.employeeId}) is teaching ${this.subject}.`;
    }
}

const p1 = new Person('Alex Doe', 40);
const s1 = new Student('Maria Hill', 22, 'S9001', 'Computer Science');
const t1 = new Teacher('Dr. Banner', 55, 'E5005', 'Physics');

console.log('--- Polymorphism (Shared Method) ---');
const people = [p1, s1, t1];
people.forEach(person => {
    console.log(person.greet());
});

console.log('\n--- Object Type Verification (instanceof) ---');
console.log(`s1 is a Student: ${s1 instanceof Student}`);
console.log(`s1 is a Person: ${s1 instanceof Person}`);
console.log(`t1 is a Student: ${t1 instanceof Student}`);
console.log(`t1 is a Teacher: ${t1 instanceof Teacher}`);

console.log('\n--- Subclass Methods ---');
console.log(s1.study());
console.log(t1.teach());