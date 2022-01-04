import { Component, OnInit } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor() {
    render({
      id: "#myPaypalButtons",
      currency: "USD",
      value: "10.00",
      onApprove: (details) =>{
        alert("Transaction Successfull");
      }
    });
   }

  ngOnInit(): void {
  }

}
