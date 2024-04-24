import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

function logEvent(node_env: string, message: string): void {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;
    const logItem = `[${node_env}] ->  ${dateTime}   ${uuid()}\t${message}`;
    console.log(logItem);
}

export { logEvent };
