import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-form-exp',
  templateUrl: './form-exp.page.html',
  styleUrls: ['./form-exp.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonicModule, ReactiveFormsModule]
})
export class FormExpPage implements OnInit {
  form = this.fb.group({
    fecha: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    capacidad: [null, [Validators.required, Validators.min(1)]],
    costo: [null, [Validators.required, Validators.min(0)]],
  });
  constructor(private fb: FormBuilder) {
    
  }

  enviar() {
    if (this.form.valid) {
      console.log('Formulario válido:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
  ngOnInit() {
  }

}
