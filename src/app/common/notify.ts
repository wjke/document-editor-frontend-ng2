export class Notify {
    private static delay: number = 5000;
    private static animateSpeed: string = 'fast';
    private static retryLoginNotify: PNotify;

    static notify(text: string, type = 'notice', delay: number = this.delay, animateSpeed: string = this.animateSpeed): PNotify {
        return new PNotify({
            text: text,
            type: type,
            delay: delay,
            animate_speed: animateSpeed
        });
    }

    static notifyInfo(text: string, delay: number = this.delay, animateSpeed: string = this.animateSpeed): PNotify {
        return this.notify(text, 'info', delay, animateSpeed);
    }

    static notifySuccess(text: string, delay: number = this.delay, animateSpeed: string = this.animateSpeed): PNotify {
        return this.notify(text, 'success', delay, animateSpeed);
    }

    static notifyError(text: string, delay: number = this.delay, animateSpeed: string = this.animateSpeed): PNotify {
        return this.notify(text, 'error', delay, animateSpeed);
    }

    static notifyRetryLogin() {
        if(!this.retryLoginNotify)
            this.retryLoginNotify = this.notifyInfo('Пожалуйста, войдите повторно');
        else if(this.retryLoginNotify.state === 'closed')
            this.retryLoginNotify.open();
    }

    static removeAll() {
        PNotify.removeAll();
    }
}
