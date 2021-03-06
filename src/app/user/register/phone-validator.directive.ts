import {Directive} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {UserService} from '../user.service';
import {catchError, map} from 'rxjs/operators';
import {Result} from '../../common/result';

@Directive({
  selector: '[appPhoneValidator]',
  providers: [
    {provide: NG_ASYNC_VALIDATORS, useExisting: PhoneValidatorDirective, multi: true}
  ]
})
export class PhoneValidatorDirective {

  constructor(private us: UserService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    // 得到数据结构是Observable<Result<string>>，
    // 但是当前函数需要Observable<ValidationErrors>
    return this.us.verifyPhone(control.value).pipe(// rxjs编程：函数式操作
      // map操作符用于数据类型转换
      map((r: Result<string>) => {
        // null说明校验通过
        return r.success ? null : {verifyPhone: true};
      }),
      // catchError操作符捕获可能出现的错误，如果出错校验就失败了，
      // 这里封装一个Observable<ValidationErrors>并返回
      catchError(e => of({verifyPhone: true}))
    );
  }
}
