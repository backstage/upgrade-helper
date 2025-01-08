<p align="center">
  <img src="/src/assets/logo.svg" width="150" />
</p>

<h1 align="center">Upgrade Helper</h1>

<p align="center">
  A web tool to help you upgrade your Backstage app with ease! 🚀
</p>

<p align="center">
  <a href="https://backstage.github.io/upgrade-helper">
    Open the tool!
  </a>
</p>

## 🎩 How it works

The **Upgrade Helper** tool aims to provide the full set of changes happening between any two versions, based on the previous work done in the [upgrade-helper-diff](https://github.com/backstage/upgrade-helper-diff) project:

> This repository exposes an untouched Backstage app generated with the CLI `npx @backstage/create-app`. Each new Backstage release causes a new project to be created, removing the old one, and getting a diff between them. This way, the diff is always clean, always in sync with the changes of the init template.

This will help you see what changes you need to do in your code.

Aside from this, the tool provides you a couple of cool extra features:

- inline comments to help you with more insights about precise files
- a set of links with further explanations on what the version you are upgrading to
- a handy "done" button near each file to help you keep track of your process
- a download button for new binary files
- the ability to toggle all files by holding the alt key and clicking on expand/collapse

## 💻 Contributing

If you want to help us making this better, you can start by forking the project and follow these steps to testing it out locally:

1. Clone the project
1. Run `yarn install`
1. Run `yarn start`
1. Open `http://localhost:3000`
1. Select starting & target versions
1. Click the `Show me how to upgrade` button

After which, you can create a branch to to make your changes and then open a PR against this repository following the provided template 🤗

## 📣 Acknowledgments

This project is a fork of [React Native Upgrade Helper](https://github.com/react-native-community/upgrade-helper) and Copyright for portions of the project are held by React Native Community.

This project proudly uses [`rn-diff-purge`](https://github.com/react-native-community/rn-diff-purge), [`react-diff-view`](https://github.com/otakustay/react-diff-view) and [`create-react-app`](https://github.com/facebook/create-react-app).

## 📝 License & CoC

This project is released under the MIT license (check the LICENSE and NOTICE files for details).
