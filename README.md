# FP-TS with Prisma and Redis Caching

This repository is an example of using the `fp-ts` functional library for TypeScript. It is a real-world API project that integrates `Prisma` for ORM functionality and Redis caching.

The purpose of this project is to demonstrate various features and concepts of `fp-ts`, such as `pipe`, `TE (TaskEither)`, `TE.bind`, `TE.map`, `TE.mapLeft`, `TE.tryCatch`, `getOrElse`, and `omit`. Additionally, it showcases the usage of `io-ts` for input and response codec checking.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Introduction

This repository provides a real-world API project that utilizes the `fp-ts` functional library for TypeScript. It is designed to help developers who want to get started with `fp-ts` but lack official documentation or guidance on where to begin. While the code and logic in this repository have been cleaned up, they were initially collected from production code.

## Features

- Integration of `fp-ts` functional library for TypeScript
- Usage of `Prisma` for ORM functionality
- Integration of Redis caching for improved performance
- Demonstrations of various `fp-ts` concepts, such as:
  - `pipe`
  - `TE (TaskEither)`
  - `TE.bind`
  - `TE.map`
  - `TE.mapLeft`
  - `TE.chain`
  - `TE.tryCatch`
  - `getOrElse`
  - `omit`
- Input and response codec checking using `io-ts`

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone git@github.com:panasun/fp-ts-prisma-redis.git`
2. Install the required dependencies: `yarn install`
3. Configure the necessary environment variables (if applicable).
4. Run the application: `yarn start`
5. Access the API at `http://localhost:3000`

## Contributing

Contributions to this project are welcome. You are encouraged to contribute by submitting examples that help newbies kickstart their journey with `fp-ts`. To contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your contribution.
3. Make the necessary changes and commit them.
4. Push your changes to the branch.
5. Submit a pull request outlining the changes you have made.

## Contact

If you have any questions or need further assistance, please feel free to reach out to me via email at panasun@i17.co.

## Acknowledgments

I would like to express my gratitude to gcanti for developing the `fp-ts` library, which has greatly facilitated the use of real functional programming in TypeScript.