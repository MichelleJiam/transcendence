# transcendence
transcendence is a [42](https://www.42network.org/)/[Codam](https://www.codam.nl/) fullstack web project about creating a single-page web application where users can play Pong against each other.  
This is a collaborative project between [Michelle Jiam](https://github.com/MichelleJiam), [Niks Hariman](https://github.com/nhariman), [Nilo Van Winden](https://github.com/nvanwinden), [Sanne Albreghs](https://github.com/salbregh), and [Swaan Miller](https://github.com/subsp4ce).  

<p align="center">
<img width="700" alt="Pong game still" src="https://user-images.githubusercontent.com/55353487/228848675-8d0c18c8-9415-440b-8df5-2cb642a0f87e.png">
</p>

## Content
- [Project Description](#description)
- [Requirements](#requirements)
- [Demos](#demos)
- [Usage](#usage)
- [Resources](#resources)
- [About Us](#about-us)

## Description
🏓 Play Pong in real-time against other users and jostle for 1st place in the leaderboard to earn eternal glory as Pong Master! 🏓  

Features include:
- **Chatrooms** 💬: users can create and join both public and private (password-protected) chatrooms, and also DM other users
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

<p align="center">
<img width="600" alt="User page" src="https://user-images.githubusercontent.com/55353487/228862131-5a858a46-ec6a-4acb-8951-e46b68aa2b0f.png">
</p>

## Requirements
You can find the full list of project requirements here: [Project Requirements](https://github.com/MichelleJiam/transcendence/wiki/Requirements)


## Demos
### Sending a game challenge through DM
https://user-images.githubusercontent.com/55353487/228855896-28fcd5b5-6d7f-412a-bf0f-86623d488d96.mov

### Reactive friends page
https://user-images.githubusercontent.com/55353487/228856725-3078a3a9-446e-40e6-94e1-503ce9a2719d.mov  
	
### More demos
See more demos of features here: [demos](https://github.com/MichelleJiam/transcendence/wiki/Videos)
	
## Usage

### Run

1. Install and run `Docker`

2. Run `./run.sh` 

	- NOTE: manually build with `docker compose up --build`

|||
| ------ | ----------- |
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

### Typescript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)  
- [Typescript’s type system from an OOP POV](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)  
- [Typescript strictness checks](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)

### Vue 3
- [Vue.js documentation](https://vuejs.org/guide/introduction.html)
- [Tutorial series: Learn Vue 3 Step by Step](https://laracasts.com/series/learn-vue-3-step-by-step/)
- State management was done using Pinia: [Video: Pinia tutorial](https://www.youtube.com/watch?v=JGC7aAC-3y8)
- Web sockets for chat, friends, and game used [Socket.IO](https://socket.io/)

### NestJS
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS-Vue 3 boilerplate](https://github.com/niclas-timm/nestjs-vue-boilerplate)  
- Very thorough guide covering most project requirements: [API with NestJS](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/) 
- [Video: "Authentication: JWTs, Sessions, Logins, and more! | NestJS PassportJS tutorial"](https://youtu.be/_L225zpUK0M)  
- [Passport strategy for 42 OAuth system](https://www.passportjs.org/packages/passport-42/)  
- Packages for 2FA: [qrcode](https://www.npmjs.com/package/qrcode), [otplib](https://www.npmjs.com/package/otplib)  
- Password hashing using [bycrypt](https://www.npmjs.com/package/bcrypt)  
- [List of validation decorators](https://github.com/typestack/class-validator#validation-decorators)

### TypeORM
- [find options](https://typeorm.io/find-options)  
- [Select using Query Builder](https://typeorm.io/select-query-builder)
- [Relations in TypeORM](https://typeorm.io/relations#relations)  
- [Eager and Lazy Relations](https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations)

### PostgreSQL
- [Setting up NestJS with PostgreSQL](https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe)
- [Video: PostgreSQL crash course](https://www.youtube.com/watch?v=zw4s3Ey8ayo)

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
