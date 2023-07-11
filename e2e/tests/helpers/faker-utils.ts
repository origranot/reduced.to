import { faker } from '@faker-js/faker';

// Names generators
export const generateValidName = () => faker.string.sample(8);

export const generateInvalidName = () => faker.string.sample(2);

// Email generators
export const generateValidEmail = () => faker.internet.email();

export const generateInvalidEmail = () => faker.string.sample(10);

// Password generators
export const generateValidPassword = () => `a${faker.internet.password({ length: 8 })}1`;

export const generateShortPassword = () => faker.internet.password({ length: 5 });
