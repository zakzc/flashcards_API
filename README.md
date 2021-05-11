# Flashcards back end (API)



## Origin and motivation

This is an app developed in the post-graducation course in Web Development Full Stack by the PUC University of Minas Gerais, Brazil.    This is the back end app, complemented by Flashcards front, that is the front end that this application communicates with. It implements a flashcard game. The game is made up of a stack of cards with questions and/or insights on some specific study area that the user reads and answers, mentally.  If the answer is correct, the user indicates and the card is removed from the stack. If it is answered incorrectly (as informed by the user), it is send back to the stack in a random position. The "game" only ends when the stack is emptied. In this case, the user receives a small feedback on his performance. The goal of the app is to help students learn study contents heavy on memorization, like concepts, formulas and, among several possibilities, study of foreign languages. The front end app deals with the display of the card, the management of cards and stacks and, finally, some quick analysis of  the student's performance. The back end (this repository) provides an interface for the storage and processing of the data in json.





## Project status

The project is in constant development and is in a current stable version, with the functionalities implemented and with some extra features (the 'could-have's) being slowly integrated.



### Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses:

- React in the front end.
- SASS for stylesheets
- Jest for tests





## Installation and set up instructions

Feel free to use, test or modify. In order to do so, you need: `node`, `npm`in your machine. Clone down the repost

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />


## Learn More - From the original React README.md file.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
