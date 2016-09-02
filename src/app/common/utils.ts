export class Utils {
    static getError(error): string {
        let err = JSON.parse(typeof error._body === 'string' ? error._body : '{}');
        return err.message || 'errors';
    }
}
