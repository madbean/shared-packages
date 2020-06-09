import { pathSatisfies, pathOr } from 'ramda';
import { isNilOrEmpty } from 'ramda-extension';

export const getMessage = response => {
    const set = getRecordSet(response);
    
    if(isNilOrEmpty(set)) return {};

    const message = getRecordSetMessage(set);

    return isNilOrEmpty(message)
        ? {}
        : message;
}

export const getMessages = response => {
    const messages = getRecordSet(response);
    
    return isNilOrEmpty(messages)
        ? []
        : messages;
}

export const getRecordSet = response => {
    const recordsets = pathSatisfies(recordsets => recordsets, ['recordsets'], response);

    if(!isNilOrEmpty(recordsets))
        return recordsets[0];

    return null;
}

export const getRecordSetMessageJSON = recordset => {
    if(!isNilOrEmpty(recordset)) {
        return JSON.parse(recordset[0].Queue_Message);
    }

    return null;
}


export const getValue = (rawMessage, path) => {
    return pathOr(null, path, rawMessage);
}

export const getRecordSetMessage = recordset => {
    if(!isNilOrEmpty(recordset))
        return recordset[0];

    return null;
}

export const getSetInputs = fields => fields
    && fields.map(({ key, value }) => ({ columnName:key, value }))

export const getSetKeys = fields => fields && fields
    .map(({ key }) => `${key} = @${key}`)
    .join(',')

export const getColumns = fields => fields
    .map(({ key }) => key)
    .join(',');