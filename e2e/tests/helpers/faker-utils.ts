import { faker } from '@faker-js/faker';

// Names generators
export const validName = () => faker.string.sample(8);
export const shortName = () => faker.string.sample(2);
export const longName = () => faker.string.sample(26);

// Email generators
export const validEmail = () => faker.internet.email();
export const invalidEmail = () => faker.string.sample(10);

// Password generators
export const validPassword = () => `a${faker.internet.password({ length: 8 })}1`;
export const shortPassword = () => faker.internet.password({ length: 5 });

// URL generator
export const validURL = () => faker.internet.url();
export const invalidURL = () => faker.internet.domainWord();
