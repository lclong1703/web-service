## Required

- node: v16.15.0
- yarn: v1.22.19
- mysql: create database with name `test`

## Start project

- Create `.env` from the `.env.example` and fulfill all environment variables
- change file `app.module.ts` line 23: `synchronize: false` to `synchronize: true`
- Start project with command `yarn start:dev`
- After start project change file `app.module.ts` line 23: `synchronize: true` to `synchronize: false`

## Features

#use postman check

- Register:

1. Enter email: use method POST

```bash
$ http://localhost:3000/users/register
```
value:
| field | Description |
| --- | --- |
| email | email for register |
2. Verify email: use method POST

```bash
$ http://localhost:3000/users/verification
```
value:
| field | Description |
| --- | --- |
| email | email for register |
| key | key for verify received in email |
3. Set-pasword: use method PATCH and set headers `email: registered email name`

```bash
$ http://localhost:3000/users/set-password
```
value:
| field | Description |
| --- | --- |
| name | name for user |
| password | password for user |
- Login: Use method POST

```bash
$ http://localhost:3000/users/login
```
value:
| field | Description |
| --- | --- |
| email | email for login |
| password | password for login |

## Description convert between dto and entity

- DTO: communication between controller and service
- Entity: communication between service and repositories
  ![alt text](https://i.imgur.com/LXGEXh3.png)
