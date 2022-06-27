import { Component, OnInit } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';
import { NewsService } from '../service/news.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    render({
      id: "#myPaypalButtons",
      currency: "USD",
      value: "10.00",
      onApprove: (details) =>{
        this.newsService.payedSubscription();
      }
    });
  }

}
