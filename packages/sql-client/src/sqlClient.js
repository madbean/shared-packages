import { getRecordSet, getRecordSetMessage } from './utils';
import { isNilOrEmpty } from '@fnb/ramda';
import sql from 'mssql';

import CacheService from './cache';
import getConfig from './poolConfig';

const ttl = process.env.TTL_DB;

export default function({WITH_LOGS, ...config}) {
    try {
        console.log('create sql client');
        const poolInstance = new sql.ConnectionPool(getConfig(config));

        poolInstance.on('error', error => {
            if(error) {
                console.log('SQL-POOL-ERROR-CODE', error.code);
                console.log('SQL-POOL-ERROR', error.message);
                process.exit(1);
            };
        })

        const dbPool = poolInstance.connect()
            .catch(error => {
                console.log('SQL-CONNECT-ERROR-CODE', error.code);
                console.log('SQL-CONNECT-ERROR', error.message);
                process.exit(1);
            });

        const cache = new CacheService(ttl);
        const withLogs = WITH_LOGS  == 'true';
    
        const query = async ({ sqlQuery, isStream = false, callbackRow, callbackDone, params, withCache = false, cacheKey, metrics = [] }) => {
            try {
                if(withLogs) {
                    console.log('[SQL][Query]', sqlQuery);
                }
        
                const pool = await dbPool;
                const request = pool.request();

                request.stream = isStream;
        
                
                if(!isNilOrEmpty(params)) {
                    params.forEach(param => param.type
                        ? request.input(param.columnName, param.type, param.value)
                        : request.input(param.columnName, param.value))
                    }
                    
                if (isStream) {
                    request.query(sqlQuery);
                        
                    request.on('error', err => {
                        console.error(`[SQL-REQUEST-ERROR-CODE]:${error.code}`);
                        console.error(`[SQL-REQUEST-ERROR]:${error.message}`);
                    })

                    request.on('row', row => {
                        // Emitted for each row in a recordset
                        callbackRow(row, null);
                    })

                    request.on('done', result => {
                        // Always emitted as the last one
                        callbackDone(result, null);
                    })
                } else {
                    const doQuery = () => request.query(sqlQuery);
                    const response = withCache
                        ? await cache.get(cacheKey, doQuery)
                        : await doQuery();
                    
                    if(withLogs) {
                        console.log('[SQL][Response]', response);
                    }

                    metrics.map(fn => fn({ statusCode: '20X' }));
                    return response;
                }
            } catch(error) {
                console.error('SQL-REQUEST-ERROR-CODE', error.code)
                console.error('SQL-REQUEST-ERROR', error.message)
                metrics.map(fn => fn({ statusCode: error.code }));

                if(error.code !== 'EREQUEST')
                    process.exit(1);
                
                console.error('SQL-REQUEST-ERROR-EREQUEST', sqlQuery)

                return null
            }
        }

        const queryUpdate = async ({ sqlQuery, isStream = false, callbackRow, callbackDone, params, withCache = false, cacheKey, metrics }) => {
            return query({ sqlQuery, isStream, callbackRow, callbackDone, params, withCache, cacheKey, metrics });
        }

        const select = async ({ columns, table, where, params, order, before, withCache = false, cacheKey, metrics }) => {
            const baseQuery = `SELECT ${columns} FROM ${table}`;
            const withClauseQuery = where ? `${baseQuery} WHERE ${where}` : baseQuery;
            const withBeforeQuery = before ? `${before} ${withClauseQuery}` : withClauseQuery;
            const sqlQuery = order ? `${withBeforeQuery} ORDER BY ${order}` : withBeforeQuery;
            const response = await query({ sqlQuery, params, withCache, cacheKey, metrics });
            
            return getRecordSet(response) 
        }

        const insert = async ({ table, columns, params, metrics }) => {
            const values = params
                .map(param => `@${param.columnName}`)
                .join(',');

            const sqlQuery = `INSERT INTO ${table} (${columns}) VALUES (${values}); SELECT SCOPE_IDENTITY()`;

            const response = await query({ sqlQuery, params, metrics });
            const record = getRecordSetMessage(getRecordSet(response));

            return record && record[''] || null;
        }

        const del = async ({ table, where, params, metrics }) => {
            const sqlQuery = `DELETE ${table} WHERE ${where}`;
            return await query({ sqlQuery, params, metrics })
        }

        const update = async ({ table, set, where, params, metrics }) => {
            const sqlQuery = `UPDATE ${table} SET ${set} WHERE ${where}`;
            
            return await query({ sqlQuery, params, metrics });
        }

        return {
            query,
            queryUpdate,
            select,
            update,
            insert,
            del,
        }
    } catch (error) {
        console.log('SQL-CONNECT-ERROR-CODE', error.code);
        console.log('SQL-CONNECT-ERROR', error.message);
        // throw Error('SQL-CONNECT-ERROR')
        process.exit(1);
    }
}