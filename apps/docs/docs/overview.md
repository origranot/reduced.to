---
title: Overview
description: Overview of the project
hide_table_of_contents: true
---

### What is Reduced.to?

Reduced.to is a modern web application designed to shorten link URLs, making them easier to remember, share, and track. The project is developed using cutting-edge technologies and services, including NestJS, Redis, Novu, PostgreSQL, and Qwik.

### How does it work?

* The website "reduced.to" offers a URL shortening service.
* Users can input long URLs into the provided field on the website.
* After inputting the URL, users click the "Shorten" button.
* The application will then generate a shortened version of the original URL.
* This shortened URL can be easily copied and shared with others.
* When someone clicks on the shortened URL, they will be redirected to the original, long URL.
* For registered users, there is a dashboard available.
* This dashboard allows users to view their list of shortened URLs.
* It also provides tools to track the performance and usage of these shortened links.

### Technologies and Services

To ensure optimal performance, the project uses Redis as a cache storage mechanism. Redis is an efficient, in-memory data structure store that enables fast retrieval of key-value pairs. By leveraging Redis, we can store and retrieve mappings between short links and their corresponding long URLs in a highly efficient manner.

We use NestJS as the backend framework for the project. NestJS is a progressive Node.js framework that offers a modular architecture and a powerful CLI. By leveraging NestJS, we can develop a robust backend that is easy to maintain and scale.

For data storage, we utilize PostgreSQL, a reliable and robust open-source relational database. PostgreSQL offers excellent data integrity and powerful querying capabilities, ensuring secure storage of user-related information while enabling efficient retrieval and manipulation as needed.

The frontend of the project is developed using Qwik, a cutting-edge framework known for its enhanced performance and scalability. By leveraging Qwik, we deliver a smooth and seamless user interface for an exceptional user experience.

In summary, the reduced.to project is a comprehensive URL shortener that incorporates various technologies and services to ensure optimal performance, security, and user experience. With the integration of Redis, Novu, PostgreSQL, and Qwik, we provide a reliable, efficient, and user-friendly platform for generating shortened URLs.

### Project Architecture Overview

![Project Architecture](/images/architecture.png)

Feel free to explore and contribute to this open-source project. We welcome new contributors and encourage you to join our community!
