import Debug from 'debug';
import config from '@src/config'
const debug = Debug('APP');
let debuggersList = ['APP']
export function log(string: string, payload: any = "") {
    if (config.DEBUG === "1") {
        Debug.enable(`APP`);
        
    } else Debug.disable();
    debug(string, payload)
}

export default {
    log
}