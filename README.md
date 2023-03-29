# transcendence
transcendence is a [42](https://www.42network.org/)/[Codam](https://www.codam.nl/) project about creating a single-page web application where users can play Pong against each other.  
This is a collaborative project between [mjiam](https://github.com/MichelleJiam), [nhariman](https://github.com/nhariman), [nvan-win](https://github.com/nvanwinden), [salbregh](https://github.com/salbregh), and [smiller](https://github.com/subsp4ce).  

## Content
- [Project Description](#description)
- [Usage](#usage)
- [Resources](#resources)
- [About Us](#about-us)

## Description
The web application allows users to play Pong in real-time against other users.
Features include:
- **Chat** 💬: users can create and join both public and private (password-protected) chatrooms, and also DM other users
- **Game by invite** ✉️: users can invite specific users to a game of Pong via DM
- **Game matchmaking** 🤝: users can enter a game queue to be matched automatically to other users looking to play a game
- **Authentication** 🔒: users can log in using the 42 OAuth system and enable 2FA
- **User account customization** 🖼️: users can change their player name and avatar
- **Friends** 👯: users can add other users as friends and see their status (online, offline, in a game)
- **Match history** 📒: user pages show last 10 games played
- **Leaderboard** 📈: users go up and down in ranking after each win/loss
- **Achievements** 🏅: users can earn achievements
- **Blocking, banning, and muting** 🔇: users can block other users to stop seeing their messages in chatrooms; chatroom admins/owners can ban or mute users from chatrooms. 

This is a full-stack single-page web application built using NestJS (backend), Vue 3 (frontend), PostgreSQL (database), and Docker (environment).

## Demos
[tba]

## Usage

### Run

1. Install and run `Docker`

2. Run `./run.sh` 

	- NOTE: manually build with `docker compose up --build`

|||
| ------ | ----------- |
| [`localhost:3000`](http://localhost:3000) | Navigate here to see backend from NestJS |
| [`localhost:5173`](http://localhost:5173) | Navigate here to see frontend from Vue + Vite |
| [`localhost:5050`](http://localhost:5050) | Navigate here to see GUI for postgreSQL |

---

### Clean

run `./clean.sh` and select  a clean option

| Prompt ||
| ------ | ----------- |
| 1. clean | this option will remove containers and delete images |
| 2. clean all | this option will additionally delete the volumes |

-	NOTE: manually clean all with `docker compose down --rmi all -v`


## Resources
### General
- Using [ESLint and Prettier](https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/) to keep the code uniformly-formatted  

### NestJS
- [NestJS documentation](https://docs.nestjs.com/)
- Very complete guide covering multiple requirements, including JWT tokens and 2FA: [API with NestJS](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/)  
- [Video: "Authentication: JWTs, Sessions, Logins, and more! | NestJS PassportJS tutorial"](https://youtu.be/_L225zpUK0M)
- [List of validation decorators](https://github.com/typestack/class-validator#validation-decorators)
- [NestJS-Vue 3 boilerplate](https://github.com/niclas-timm/nestjs-vue-boilerplate)

### Vue 3
- [Vue.js documentation](https://vuejs.org/guide/introduction.html)

### Typescript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)  

### TypeORM
- [find options](https://typeorm.io/find-options)  
- [Select using Query Builder](https://typeorm.io/select-query-builder)
- [Relations in TypeORM](https://typeorm.io/relations#relations)  
- [Eager and Lazy Relations](https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations)

### Chat
- [Build a Real-time Chat App with Vue 3, Socket.io and Nodejs](https://masteringbackend.com/posts/build-a-real-time-chat-app-with-vue-3-socket-io-and-nodejs)  
- [Building a NestJS Chat App with Websockets and MySQL](https://progressivecoder.substack.com/p/building-a-nestjs-chat-app-with-websockets)  
- [Build a Real-time Chat Application With Nestjs and PostgreSQL](https://betterprogramming.pub/build-a-real-time-chat-application-with-nestjs-and-postgresql-a212502eb436)

## About Us
Michelle Jiam - [LinkedIn](https://www.linkedin.com/in/mljiam/) / [Github](https://github.com/MichelleJiam)  
Niks Hariman - [LinkedIn](https://www.linkedin.com/in/niks-hariman-msc-aaa74b152/) / [Github](https://github.com/nhariman)  
Nilo Van Winden - [LinkedIn](https://www.linkedin.com/in/n-van-winden/) / [Github](https://github.com/nvanwinden)  
Sanne Albreghs - [LinkedIn](https://www.linkedin.com/in/sanne-albreghs-ba09141a3/) / [Github](https://github.com/salbregh)  
Swaan Miller - [LinkedIn](https://www.linkedin.com/in/swaan-miller-6a4844244/) / [Github](https://github.com/subsp4ce)
