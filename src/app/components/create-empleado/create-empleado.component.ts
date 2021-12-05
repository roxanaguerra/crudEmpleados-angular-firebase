import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log('id empleado: ', this.id);
  }

  ngOnInit(): void {
    this.esEditar()
  }

  agregarEditarEmpleado() {
    // console.log("agregar empleado: ", this.createEmpleado);
    this.submitted = true;
    if(this.createEmpleado.invalid){
      return
    }
    this.loading = true;

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }
    
  }

  agregarEmpleado() {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    console.log("datos empleado nuevo: ", empleado);

    // CONSUMIENDO EL SERVICIO - AGREGAR NUEVO EMPLEADO
    this._empleadoService.agregarEmpleado(empleado)
    .then(() => {
      console.log("Se agrego empleado con exito");
      this.toastr.success('Se agrego empleado con exito', 'EMPLEADO REGISTRADO', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch(error =>{
      console.log("Error: ", error);
      this.loading = false;
    }); 
  }

  editarEmpleado(id: string){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date(),
    }

    this.loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado)
    .then(() => {
      this.toastr.info('El empleado fue editado con exito!', 'EMPLEADO ACTUALIZADO', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch(error =>{
      console.log("Error: ", error);
      this.loading = false;
    });
  }

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar Empleado';
      this.loading = true;
      this._empleadoService.getEmpleadoId(this.id).subscribe(data => {
        this.loading = false;
        console.log('Data: ', data.payload.data());
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      })
    }
  }
}
