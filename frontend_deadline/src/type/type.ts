export interface Paging<T> { 
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export interface Employee {
    id: number,
    fullName: string,
    email: string,
    dateOfBirth: string,
    gender: string,
    phoneNumber: string | null,
    active: boolean
}

export interface UpdateEmployee {
    fullName: string,
    dateOfBirth: string,
    gender: string,
    phoneNumber: string,
    // password: string,
}

export interface CreateEmployee {
    fullName: string,
    email: string,
    dateOfBirth: string,
    gender: string,
    phoneNumber: string,
    password: string,
}