
export default config => {
    const {
        SQL_DATABASE,
        SQL_CONNECTION_TIMEOUT,
        SQL_REQUEST_TIMEOUT,
        SQL_POOL_MAX,
        SQL_POOL_MIN,
        SQL_POOL_IDLE_TIMEOUT,
        SQL_USER,
        SQL_PASSWORD,
        SQL_SERVER,
        SQL_USER_DEV,
        SQL_PASSWORD_DEV,
        SQL_SERVER_DEV,
        ENV,
        WITH_LOGS
    } = config;

    const common = {
        database: SQL_DATABASE,
        connectionTimeout: parseInt(SQL_CONNECTION_TIMEOUT),
        requestTimeout: parseInt(SQL_REQUEST_TIMEOUT),
        pool: {
            max: parseInt(SQL_POOL_MAX),
            min: parseInt(SQL_POOL_MIN),
            idleTimeoutMillis: parseInt(SQL_POOL_IDLE_TIMEOUT)
        },
        WITH_LOGS,
    }
    
    const sqlConfig = {
        user: SQL_USER,
        password: SQL_PASSWORD,
        server: SQL_SERVER,
        ...common
    };

    const sqlConfig_DEV = {
        user: SQL_USER_DEV,
        password: SQL_PASSWORD_DEV,
        server: SQL_SERVER_DEV,
        ...common
    };

    return ENV === 'prod' ? sqlConfig : sqlConfig_DEV;
}