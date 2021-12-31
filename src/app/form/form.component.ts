import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  maquinas = [
    {
        codigo: "C01", 
        maquinaria:'Tractor', 
        tarifa: 100
    }, 
    {
        codigo: 'C02',
        maquinaria: 'Mezclador',
        tarifa: 50,
    },
    {
        codigo: 'C03',
        maquinaria: 'Volqueta',
        tarifa: 150,
    }
  ];  
  formulario: FormGroup;
  fechaEntrega = new Date;
  fechaDevolucion = new Date;
  diff: number = 0;
  fechActual: number = 0;
  desc: number = 0;
  tarifa:any = 0;
  alquiler = [
    {
      cliente: '',
      maquinaria: '',
      fechaE: '',
      fechaD:'',
      dias: '',
      importe: '',
      descuento: '',
      garantia: '',
      total: ''
    }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.form();
   }

  ngOnInit(): void {
  }
  
  form() {
    return (this.formulario = this.formBuilder.group({
      cliente: ['', [Validators.required]],
      maquinaria: ['', [Validators.required]],
      fechaE: ['', [Validators.required]],
      fechaD: ['', [Validators.required]],
    }));
  }

  alquilar() {
    if (!this.formulario.invalid) {
      if (this.calcularDias() >= 0) {
        this.formulario.value.dias = this.calcularDias()
        this.formulario.value.importe = this.importe()
        this.formulario.value.descuento = this.descuento()
        this.formulario.value.garantia = this.garantia()
        this.formulario.value.total = this.importeTotal()
        this.alquiler.push(this.formulario.value);
      } else alert('Las fecha no son correctas');
    }
  }

  calcularDias(): number {
    this.fechaEntrega = new Date(this.formulario.value.fechaE);
    this.fechaDevolucion = new Date(this.formulario.value.fechaD)
    if (this.fechaDevolucion >= this.fechaEntrega) {
      this.diff = this.fechaDevolucion.getTime() - this.fechaEntrega.getTime();
      this.fechActual = Math.round(this.diff / (1000 * 60 * 60 * 24));
      return this.fechActual   
    } else {
      return -1 
    }
  }

  importe():number {
    this.tarifa = this.maquinas.find((e) => e.codigo === this.formulario.value.maquinaria)?.tarifa;
      return this.tarifa * this.calcularDias()
  }
  
  descuento(): number {
    if (this.calcularDias() > 7) {
      this.desc = this.importe() * 0.1;
    }
    return this.desc
  }

  importeTotal():number {
    return this.importe() - this.descuento();
  }

  garantia():number {
    return this.importeTotal() * 0.1;
  }
}
