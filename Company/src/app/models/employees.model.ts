export class Employee {
    employeeId!: number;
    firstName!: string;
    lastName!: string;
    phoneNumber!: string;
    email!: string;
    salary!: number;
    hireDate!: string;
    departmentId!: number;  // ← FK
    jobTitleId!: number;    // ← FK
}