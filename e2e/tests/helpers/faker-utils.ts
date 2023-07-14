import { faker } from '@faker-js/faker';

// Names generators
export const generateValidName = () => faker.string.sample(8);

export const generateShortName = () => faker.string.sample(2);

export const generateLongName = () => faker.string.sample(26);

// Email generators
export const generateValidEmail = () => faker.internet.email();

export const generateInvalidEmail = () => faker.string.sample(10);

// Password generators
export const generateValidPassword = () => `a${faker.internet.password({ length: 8 })}1`;

export const generateShortPassword = () => faker.internet.password({ length: 5 });

// URL generator
export const generateValidURL = () => faker.internet.url();

export const generateInvalidURL = () => faker.internet.domainWord();
