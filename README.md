<p  align="center">
 <img src="https://i.ibb.co/zh8k46H/logo-square.png" height=170 alt="Permit.io" border="0">
</p>
<h1 align="center">
Permit.io Demo (Todos)
</h1>

# What's in this repo?

Permit.io is the permissions infrastructure for the internet. A fullstack authorization solution enabling developers to bake-in access-control into their products within minutes and have them ready for future demands from customers and regulation.

In this repo you'll find a demo todos application implemented in Node.js that uses permit.io to enforce permissions.

# How to run this app

## 1. Prerequisites

This app requires an Auth0 account (for authentication) and Permit.io account (for authorization).

### Auth0 Account
If you want to open your own Auth0 account (for authentication), [click here](https://auth0.com/signup). 

By default the app will use an Auth0 account controlled by Permit.io so it's not mandatory.

### Permit.io Account
You'll need to:
1) Open a free Permit.io account [here](https://app.permit.io).
2) Complete the account setup, see video tutorial [here](https://docs.permit.io/tutorials/onboarding_demo).
3) Get your [API Key](https://docs.permit.io/tutorials/quickstart) and save it to .env

## 2. Install dependencies
```
make install
```

## 3. Run the app without permissions enforced
```
make run
```

## 4. Run the app with permissions enforced
```
make run-with-permissions
```

# <a name="community"></a>Community and support

- You can find our full documentation at [docs.permit.io](https://docs.permit.io).
- You can join our [slack community][join-slack-link] for help.

[![Button][badge-slack-link]][join-slack-link]

[badge-slack-link]: https://i.ibb.co/wzrGHQL/Group-749.png
[join-slack-link]: https://bit.ly/permitioslack
