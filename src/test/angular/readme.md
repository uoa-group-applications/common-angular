# Testing This Project

This is a guide for running tests on angular code in this project. While there may be a reasonable amount of
duplication present in this text, it will act to the benefit of subsequent developers to have this knowledge localised
and customised for this specific project.

## Requirements For Testing

Due to the lack of a magical maven plugin that does all this for us, there are some things that need to exist in and
around this project before testing can begin.

### NodeJS

This allows the javascript tests to be executed in an environment that isn't tied to a browser. Since there are
radically differing ways of getting this installed, consult the specific environment documentation below.

#### Windows

Just follow these few, easy steps:

1. Navigate to [Nodejs.org](http://nodejs.org).
2. Press install, and download the msi.
3. Run the msi installer.
4. Profit

#### Linux

    TODO: Describe how to install NodeJS on Linux

### Karma

Formerly known as Testacular, this javascript testing framework is required for running e2e tests, and can be acquired
by a simple and concise application of the following command:

    npm install -g karma

This will make sure that all NodeJS applications on your machine have access to this framework. The Maven runner should
take care of actually running it.

## How To Run These Tests

    TODO: Summary/External References

### Unit tests

    TODO: Explain how to run unit tests

### End-to-end (e2e) tests

    TODO: Explain how to run e2e tests
