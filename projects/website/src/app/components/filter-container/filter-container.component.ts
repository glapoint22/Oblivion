import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent implements OnInit {
  @Input() caption!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
