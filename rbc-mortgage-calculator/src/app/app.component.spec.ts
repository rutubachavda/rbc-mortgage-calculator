import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Payment Plan');
  });

  it('should have initial form values', () => {
    const mortgageFormValues = {
      mortgageAmt: null,
      interestRate: null,
      amortizationPeriod: null,
      paymentFrequency: 'Monthly',
      term: null
    }
    expect(component.mortgageForm.value).toEqual(mortgageFormValues);
  });

  it('should have been called calculateMortgageAmt method', () => {
    spyOn(component, 'calculateMortgageAmt');
    const compiled = (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(component.calculateMortgageAmt).toHaveBeenCalled(); 
  });

  it('should calculate monthly mortgage amout', () => {
    component.mortgageForm.setValue({
      mortgageAmt: 100000,
      interestRate: 5,
      amortizationPeriod: 25,
      paymentFrequency: 'Monthly',
      term: 5
    });
    component.calculateMortgageAmt();

    expect(component.calSummary[1].amortPeriod).toEqual('581.60');
  });

  it('should calculate semi-monthly mortgage amout', () => {
    component.mortgageForm.setValue({
      mortgageAmt: 100000,
      interestRate: 5,
      amortizationPeriod: 25,
      paymentFrequency: 'Semi-monthly',
      term: 5
    });
    component.calculateMortgageAmt();

    expect(component.calSummary[1].amortPeriod).toEqual('290.50');
  });

  it('should calculate Bi-weekly mortgage amout', () => {
    component.mortgageForm.setValue({
      mortgageAmt: 100000,
      interestRate: 5,
      amortizationPeriod: 25,
      paymentFrequency: 'Bi-weekly',
      term: 5
    });
    component.calculateMortgageAmt();

    expect(component.calSummary[1].amortPeriod).toEqual('268.14');
  });

  it('should calculate weekly mortgage amout', () => {
    component.mortgageForm.setValue({
      mortgageAmt: 100000,
      interestRate: 5,
      amortizationPeriod: 25,
      paymentFrequency: 'Weekly',
      term: 5
    });
    component.calculateMortgageAmt();

    expect(component.calSummary[1].amortPeriod).toEqual('134.00');
  });
});
