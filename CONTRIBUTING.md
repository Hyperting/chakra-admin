# Contributing

Thanks for your interest in contributing to Chakra Admin.

We're so glad you want to help! 💖

## Project Overview

This project is a monorepo managed with `turborepo`.

It uses `pnpm` to manage dependecies.

## Setup the Project

1. Fork this repository
2. Clone your fork to your local machine

```bash
git clone https://github.com/<your_github_username>/chakra-admin.git
cd chakra-admin
```

3. Install all dependencies and cross dependencies by running:

```bash
pnpm i
```

4. Build the project:

```bash
pnpm build
```

5. Start the example project:

```bash
pnpm dev --filter=kitchen-sink...
```

## Update chakra-admin in the example project

In order to show the changes made in the `packages` directory inside the example project, you have to run:

```bash
# go to the chakra-admin project
cd chakra-admin

# build all packages
pnpm build
```

You can now use your new or changed components in the example project.

## Project Commands

Here's a list of the commands provided by this project:

`pnpm build`: build all the packages

`pnpm storybook`: run Storybook for components development (WIP: currently not working)

## Commit convention

Chakra Admin follows the [Convential Commits specification](https://www.conventionalcommits.org/).

Write the commit like this:

```

category(scope or module): your commit message

```

Where category is one of:

`feat`: changes that introduce new code or features

`fix`: changes that fix a bug (reference an issue if present)

`refactor`: any code related change that is not a fix, nor a feature

`docs:` changing existing or creating new documentation (README.md, etc.)

`chore`: all changes to the repository that do not fit into any of the above categories.

```

```
