import { filter, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { translations } from '@app/shared/translations';
import { TabOptions } from '@app/shared/types/interfaces';

@Component({
  selector: 'app-auth',
  template: `
    <div
      [ngClass.lt-md]="'display-none'"
      [ngClass.gt-sm]="'welcome-section'"
      fxFlex.gt-sm="50%"
      fxLayout.gt-sm="column"
      fxLayoutAlign.gt-sm="center center"
    >
      <img
        [ngStyle]="{ height: '112px' }"
        [src]="'assets/icons/logo.svg'"
        class="margin-bottom-xl"
        alt="logo-icon"
      />

      <span
        i18n
        class="mat-display-3 light-contrast-color text-align-center margin-bottom-m"
      >
        {{ 'auth.welcomeText' | translate }}
      </span>
    </div>

    <div
      fxFlex.lt-md="100%"
      fxFlex.gt-sm="50%"
      fxLayout="column"
      fxLayoutAlign="space-between center"
      class="padding-vertical-xl form-section"
    >
      <div
        fxLayout="row"
        [ngClass.lt-md]="'mat-title'"
        [ngClass.gt-sm]="'mat-headline'"
      >
        <ng-container *ngIf="currentPath$ | async as currentPath">
          <app-toggle-tab
            *ngIf="
              currentPath === '/auth/login' || currentPath === '/auth/register'
            "
            [tabOptions]="authOptions"
            [activePath]="currentPath"
            (switchTabEvent)="onSwitchOption($event)"
          >
          </app-toggle-tab>
        </ng-container>
      </div>
      <router-outlet></router-outlet>
      <img
        *ngIf="(currentPath$ | async) !== '/auth/register'"
        [src]="'assets/icons/logo.svg'"
        alt="logo"
        [ngStyle]="{ height: '64px' }"
        [ngClass.lt-md]="'display-none'"
      />
    </div>
  `,
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  currentPath$ = new BehaviorSubject<string>('');
  authOptions: TabOptions[] = [
    {
      title: translations.auth.login.title,
      path: '/auth/login'
    },
    {
      title: translations.auth.register.title,
      path: '/auth/register'
    }
  ];
  private ngUnsubscribe = new Subject();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPath$.next(this.router.url.split('?')[0]);
    this.subscribeToRouteChanges();
  }

  onSwitchOption(path: string): void {
    this.router.navigate([path]);
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(event => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).url)
      )
      .subscribe((url: string) => this.currentPath$.next(url));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
