import { Component, OnInit } from '@angular/core';
import {ClientService} from "@app/user/services";
import {Router} from "@angular/router";
import {UserService} from "@app/shared/services/user.service";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  public userName: string = null;
  public loading = false;

  constructor(private clientService: ClientService, private router: Router, private userService: UserService  ) { }

  ngOnInit(): void {
    this.userService.setUser().subscribe((user)=> {
      this.userName = user.username;
      console.log(this.userName);
    });
  }

  sendMail() {
    this.userService.sendEmail().subscribe();
  }
}
