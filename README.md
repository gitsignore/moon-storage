# Moon-Storage &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gitsignore/moon/blob/master/LICENSE) [![GuardRails badge](https://badges.production.guardrails.io/gitsignore/moon-storage.svg)](https://www.guardrails.io)

This is the API part of the following application [Moon](https://github.com/gitsignore/moon)

## Installation

1.  Local Docker installation

    - Install `Moon-Storage` by running:

    ```sh
    > git clone https://github.com/gitsignore/moon-storage && cd moon-storage
    ```

    - Build `Moon-Storage`'s app according to your hardware and your environment:

    ```sh
    # Production build
    > docker build -t moon-storage .

    # Development build
    > docker build -f Dockerfile-dev -t moon-storage .

    # Arm v7 build (aka: Raspberry Pi)
    > docker build -f Dockerfile-arm32v7 -t moon-storage .
    ```

    - Run `Moon-Storage`'s app:

    ```sh
    > docker run -p 8080:8080 --name moon-storage -d moon-storage
    ```

    > You can provide parameters on run like:
    >
    > - Application port : -p <host_port>:8080
    > - Database data volume : -v <host_data_folder>:/usr/app/data
    > - Cors origin URI : -e CORS_ORIGIN_URI='http://localhost:3000'

    - Open your browser to <http://localhost:8080/teams>

2.  Local Node/npm installation

    - Install `Moon-Storage` by running:

    ```sh
    > git clone https://github.com/gitsignore/moon-storage && cd moon-storage
    ```

    - Then install dependencies:

    ```sh
    > npm install
    ```

    - Launch `Moon-Storage` app with:

    ```sh
    > npm run dev
    ```

    - Open your browser to <http://localhost:8080/teams>

    Replace the default 8080 port by another one in `.env` file

## License

Moon-Storage is MIT licensed.
