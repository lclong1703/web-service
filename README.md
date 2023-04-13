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

use postman check

- Register:

# 1.enter email: use method POST

```bash
$ http://localhost:3000/users/register
```

# verify email: use method POST

```bash
$ http://localhost:3000/users/verification
```

# set-pasword: use method PATCH and set headers `email: registered email name`

```bash
$ http://localhost:3000/users/set-password
```

- Login: Use method POST

```bash
$ http://localhost:3000/users/login
```

## Description convert between dto and entity

- DTO: communication between controller and service
- Entity: communication between service and repositories
  ![alt text](https://i.imgur.com/LXGEXh3.png)
