import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {makeStateKey, TransferState} from '@angular/platform-browser';

@Injectable()
export class BrowserStateInterceptor implements HttpInterceptor {
	constructor(private transferState: TransferState) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler) {
		if (request.method === 'GET') {
			const key = makeStateKey(request.url);
			const storedResponse = this.transferState.get(makeStateKey(key), undefined);
			if (storedResponse) {
				this.transferState.remove(key);
				const response = new HttpResponse({body: storedResponse, status: 200});
				return of(response);
			}
		}

		return next.handle(request);
	}
}
