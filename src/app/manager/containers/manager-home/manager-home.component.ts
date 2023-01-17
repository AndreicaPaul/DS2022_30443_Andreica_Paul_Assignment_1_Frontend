import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "@app/shared/services/user.service";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.scss']
})
export class ManagerHomeComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.router.navigate(['users'],{relativeTo: this.activatedRoute});
    this.userService.setUser().subscribe();
  }

  onShowUsers() {
    this.router.navigate(['users'], {relativeTo: this.activatedRoute});
  }

  onShowDevices() {
    this.router.navigate(['devices'], {relativeTo: this.activatedRoute});
  }
}
