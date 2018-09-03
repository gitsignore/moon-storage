# Moon-Storage &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gitsignore/moon/blob/master/LICENSE)

This is the API part of the following application [Moon](https://github.com/gitsignore/moon)

## Installation

1. Docker installation

   - Install `Moon-Storage` by running:

   ```sh
   git clone https://github.com/gitsignore/moon-storage && cd moon-storage
   ```

   - Use `Moon-Storage`'s integrated console to launch the app:

   ```sh
   bin/console start
   ```

   - Open your browser to <http://localhost:8080/teams>

     Replace the default 8080 port by another one in `.env` file

2. Local Node/npm installation

   - Install `Moon-Storage` by running:

   ```sh
   git clone https://github.com/gitsignore/moon-api && cd moon-api
   ```

   - Then install dependencies:

   ```sh
   npm install
   ```

   - Launch `Moon-Storage` app with:

   ```sh
   node index.js
   ```

   - Open your browser to <http://localhost:8080/teams>

   Replace the default 8080 port by another one in `.env` file

## License

Moon-Storage is MIT licensed.
