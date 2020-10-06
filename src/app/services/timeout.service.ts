import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

// This class is responsible for handaling session timeout

export class TimeoutService {

    private componentMethodCallSource = new Subject<any>();

    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    confirmationPageCount: number = 0;
    claimPageCount: number = 0;
    onConfirmPage: boolean = false;
    public sessiontimeoutdata: any = '';
    constructor(
        private idle: Idle,
        private keepalive: Keepalive,
        private router: Router,
        private translate: TranslateService
    ) {
    }


    async init(onConfirm) {
        this.stop();
        this.onConfirmPage = onConfirm;
        this.idle.setIdle(60 * environment.timeOut);
        // this.idle.setIdle(5);

        this.idle.setTimeout(5);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);


        this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
        this.idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;

            if (this.onConfirmPage) {
                if (this.confirmationPageCount < 1) {

                    this.notify();
                } else {

                    this.logout();
                }
            } else {

                if (this.claimPageCount < 10) {
                    this.notify();
                } else {
                    this.logout();
                }
            }

        });
        this.idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!';
        });
        this.idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You will time out in ' + countdown + ' seconds!';
        }
        );

        // sets the ping interval to 15 seconds
        this.keepalive.interval(10);

        this.keepalive.onPing.subscribe(() => {
            this.lastPing = new Date();
        });
        this.reset();
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    stop() {
        this.idle.stop();
    }

    private notify() {
        let timerInterval;
        const timer1 = 60000;
        this.translate.get('sessiontimeout').subscribe((data: any) => {
            this.sessiontimeoutdata = data;
        });

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-wsib',
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: `<div  aria-label="${this.sessiontimeoutdata.title}">${this.sessiontimeoutdata.title}</div>`,
            html:
                `<br /><div style="font-size: 15px;" aria-label="${this.sessiontimeoutdata.massage} 0 : 60 minutes ${this.sessiontimeoutdata.secondmassage} ">${this.sessiontimeoutdata.massage} 0 : <span></span> minutes</div>`,
            confirmButtonText: `<div autofocus>${this.sessiontimeoutdata.confirmButtonText}</div>`,
            confirmButtonAriaLabel: this.sessiontimeoutdata.massage + '60 Second' + this.sessiontimeoutdata.secondmassage + this.sessiontimeoutdata.trddmassage,


            footer: ` <button aria-label="${this.sessiontimeoutdata.footer}" id="buttonId" style="border:none;color: #337ab7;background-color: transparent;box-shadow: none;">${this.sessiontimeoutdata.footer}</button>`,


            showCancelButton: false,
            timer: timer1,

            cancelButtonText: 'Logout',
            onBeforeOpen: () => {
                document.getElementById('buttonId').onclick = () => {
                    Swal.close();
                    this.logout();
                    return;
                };

                timerInterval = setInterval(() => {
                    const content = Swal.getContent()?.querySelector('span');
                    const left = Swal.getTimerLeft();
                    if (content) {
                        content.textContent = `${(left / 1000).toFixed(0)}`;
                    }
                }, 100);
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        }).then(res => {
            if (res.dismiss === Swal.DismissReason.timer) {
                this.stop();
            }
            if (res.value) {

                if (this.onConfirmPage) {
                    this.confirmationPageCount++;
                } else {
                    this.claimPageCount++;
                }
                this.reset();
            } else {
                this.logout();
            }
        });
    }

    componentMethodCalled = this.componentMethodCallSource.asObservable();
    callComponentMethod() {
        this.componentMethodCallSource.next(sessionStorage.getItem('component'));
    }

    logout() {
        if (!this.onConfirmPage) {
            this.confirmationPageCount = 0;
        }
        this.claimPageCount = 0;
        this.stop();
        Swal.close();
        this.callComponentMethod();

        setTimeout(() => {
            this.router.navigate(['/time-out']);
        }, 2000);
    }
}
