# transcendence
transcendence is a [42](https://www.42network.org/)/[Codam](https://www.codam.nl/) project about creating a single-page web application where users can play Pong against each other.  
This is a collaborative project between [mjiam](https://github.com/MichelleJiam), [nhariman](https://github.com/nhariman), [nvan-win](https://github.com/nvanwinden), [salbregh](https://github.com/salbregh), and [smiller](https://github.com/subsp4ce).  

## Content
- [Project Description](#description)
- [Usage](#usage)
- [Resources](#resources)
- [About Us](#about-us)

## Description

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

## About Us
Michelle Jiam - [LinkedIn](https://www.linkedin.com/in/mljiam/) / [Github](https://github.com/MichelleJiam)  
Niks Hariman - [LinkedIn](https://www.linkedin.com/in/niks-hariman-msc-aaa74b152/) / [Github](https://github.com/nhariman)  
Nilo Van Winden - [LinkedIn](https://www.linkedin.com/in/n-van-winden/) / [Github](https://github.com/nvanwinden)  
Sanne Albreghs - [LinkedIn](https://www.linkedin.com/in/sanne-albreghs-ba09141a3/) / [Github](https://github.com/salbregh)  
Swaan Miller - [LinkedIn](https://www.linkedin.com/in/swaan-miller-6a4844244/) / [Github](https://github.com/subsp4ce)
