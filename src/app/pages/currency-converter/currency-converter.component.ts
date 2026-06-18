// usa currency.service.ts para la lista de monedas y la conversión
// la lógica de llamadas http está en src/app/core/services/currency.service.ts
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../../core/services/currency.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './currency-converter.component.html'
})
export class CurrencyConverterComponent implements OnInit {

  currencies: { code: string; name: string }[] = [];
  converterForm!: FormGroup;
  result: number | null = null;
  rate: number | null = null;
  loading: boolean = false;
  currenciesLoading: boolean = true;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    // armo el formulario reactivo con valores por defecto
    this.converterForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['USD'],
      toCurrency: ['ARS']
    });
    this.loadCurrencies();
  }

  // cargo la lista de monedas y la convierto en array usable
  loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (data) => {
        // convierto el objeto { USD: "US Dollar", ... } en un array
        this.currencies = Object.entries(data.currencies).map(([code, name]) => ({
          code,
          name: name as string
        }));
        this.currenciesLoading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMsg = 'API key inválida. Verificá la clave de APILayer en environment.ts.';
        } else if (err.status === 429) {
          this.errorMsg = 'Límite de solicitudes alcanzado. Intentá en unos minutos.';
        } else {
          this.errorMsg = 'Error al cargar las monedas. Verificá la API key.';
        }
        this.currenciesLoading = false;
      }
    });
  }

  // valida el form y hace la conversión
  onConvert(): void {
    if (this.converterForm.invalid) return;

    this.loading = true;
    this.result = null;
    this.rate = null;
    this.errorMsg = '';

    const { amount, fromCurrency, toCurrency } = this.converterForm.value;

    this.currencyService.convertCurrency(fromCurrency, toCurrency, amount).subscribe({
      next: (data) => {
        this.result = data.result;
        this.rate = data.info?.rate ?? null;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 429) {
          this.errorMsg = 'Límite de solicitudes alcanzado. Intentá en unos minutos.';
        } else {
          this.errorMsg = 'Error al realizar la conversión. Verificá los datos ingresados.';
        }
        this.loading = false;
      }
    });
  }
}
