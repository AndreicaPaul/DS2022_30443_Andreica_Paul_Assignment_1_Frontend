import { Component, OnInit } from '@angular/core';
import {ManagersService} from "@app/manager/services";
import { Location } from "@app/manager/types/interfaces";
import {Observable} from "rxjs";
import {UserService} from "@app/shared/services/user.service";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.scss']
})
export class ManagerHomeComponent implements OnInit {

  public locations$: Observable<Location[]>;
  public firstTime: boolean = true;
  constructor(private managersService: ManagersService,
              private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.setUser().subscribe((user) => {
    });
    this.locations$ = this.managersService.getLocations();
  }
}
