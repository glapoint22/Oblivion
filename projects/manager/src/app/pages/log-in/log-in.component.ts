import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService, DataService } from 'common';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor(private dataService: DataService, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if(form.valid){
      this.dataService.post('api/Account/LogIn', {
        email: form.controls.email.value,
        password: form.controls.password.value,
      })
        .subscribe({
          complete: () => {
            this.accountService.logIn();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              // this.form.controls.email.setErrors({ noMatch: true });
            }
          }
        });
    }
    
  }

}
