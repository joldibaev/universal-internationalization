import {Inject, Injectable, Optional} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {Request} from 'express';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {
	constructor(@Optional() @Inject(REQUEST) private request: Request, private transferState: TransferState) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler) {
		const clonedRequest = request.clone({
			headers: request.headers
				.set('X-Forwarded-For', this.request?.headers['x-forwarded-for'] || '')
				.set('X-Referer', this.request?.headers.referer || '')
				.set('User-Agent', this.request?.headers['user-agent'] || ''),
		});

		return next.handle(clonedRequest).pipe(
			tap((event) => {
				if (event instanceof HttpResponse && (event.status === 200 || event.status === 202)) {
					this.transferState.set(makeStateKey(request.url), event.body);
				}
			}),
		);
	}
}
