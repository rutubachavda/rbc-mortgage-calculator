import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Summary {
  category: string,
  term: string,
  amortPeriod: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  calSummary: Summary[] = [];
  paymentFrequencyList = ['Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly', 'Accelerated Bi-weekly', 'Accelerated Weekly']
  mortgageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.mortgageForm = this.fb.group({
      mortgageAmt: [],
      interestRate: [],
      amortizationPeriod: [],
      paymentFrequency: ['Monthly'],
      term: []
    });
  }

  calculateMortgageAmt() {
    this.calSummary = [];
    if(this.mortgageForm?.value) {
      let rate = 0, amortizationMonths = 0, termMonths = 0;
      switch(this.mortgageForm.value.paymentFrequency) {
        case 'Monthly':
          rate = Math.pow((this.mortgageForm.value.interestRate/100)/2 + 1, 1/6) - 1;
          amortizationMonths = this.mortgageForm.value.amortizationPeriod * 12;
          termMonths = this.mortgageForm.value.term * 12;
          break;
        
        case 'Semi-monthly':
          rate = Math.pow((this.mortgageForm.value.interestRate/100)/2 + 1, 1/12) - 1;
          amortizationMonths = this.mortgageForm.value.amortizationPeriod * 12 * 2;
          termMonths = this.mortgageForm.value.term * 12 * 2;
          break;
        
        case 'Bi-weekly':
          rate = Math.pow((this.mortgageForm.value.interestRate/100)/2 + 1, 2/26) - 1;
          amortizationMonths = Math.round((365/7)/2) * this.mortgageForm.value.amortizationPeriod;
          termMonths = Math.round((365/7)/2) * this.mortgageForm.value.term;
          break;

        case 'Weekly':
          rate = Math.pow((this.mortgageForm.value.interestRate)/100/2 + 1, 2/52) - 1;
          amortizationMonths = Math.round(365/7) * this.mortgageForm.value.amortizationPeriod;
          termMonths = Math.round(365/7) * this.mortgageForm.value.term;
          break;
      }
      let rateWithExpo = Math.pow(1+rate, amortizationMonths);
      let mortgageMonthlyPayment = (this.mortgageForm.value.mortgageAmt * ((rate * rateWithExpo)/(rateWithExpo - 1)))
      let beginningBalance = this.mortgageForm.value.mortgageAmt;
      let principlePayment = 0, interestPayment = 0, endingBalance = 0;
      let termInterestPayment = 0, termPrinciplePayment = 0, totalInterestPayment = 0, totalPrinciplePayment = 0;

      for(let i=1; i<=amortizationMonths; i++) {
        interestPayment = beginningBalance * rate;
        principlePayment = mortgageMonthlyPayment - interestPayment;
        endingBalance = beginningBalance - principlePayment;
        beginningBalance = endingBalance; 

        totalInterestPayment += interestPayment;
        totalPrinciplePayment += principlePayment;

        if(i==termMonths) {
          termInterestPayment = totalInterestPayment;
          termPrinciplePayment = totalPrinciplePayment;
        }
      }
      
      this.calSummary.push({
        category: 'Number of Payments',
        term: termMonths.toString(),
        amortPeriod: amortizationMonths.toString()
      }, 
      {
        category: 'Mortgage Payment',
        term: mortgageMonthlyPayment.toFixed(2),
        amortPeriod: mortgageMonthlyPayment.toFixed(2)
      },
      {
        category: 'Prepayment',
        term: '0',
        amortPeriod: '0'
      },
      {
        category: 'Principal Payments',
        term: termPrinciplePayment.toFixed(2),
        amortPeriod: totalPrinciplePayment.toFixed(2)
      },
      {
        category: 'Interest Payments',
        term: termInterestPayment.toFixed(2),
        amortPeriod: totalInterestPayment.toFixed(2)
      },
      {
        category: 'Total Cost',
        term: (termPrinciplePayment + termInterestPayment).toFixed(2),
        amortPeriod: (totalPrinciplePayment + totalInterestPayment).toFixed(2)
      })
    }
  }  
}
