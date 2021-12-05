import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  items: Observable<any[]>;
  empleados: any[] = [];

  constructor(firestore: AngularFirestore,
             private _empleadoService: EmpleadoService,
             private toastr: ToastrService) {
    // 


    // PARA HACER PRUEBAS
    this.items = firestore.collection('items').valueChanges();
  }

  ngOnInit(): void {
    this.getEmpleado();
  }

  getEmpleado() {
    this._empleadoService.getEmpleados().subscribe(data =>{
      this.empleados = [];
      // console.log("Data Empleado: ", data);
      data.forEach((element:any) => {
        // console.log('Id Doc: ', element.payload.doc.id)
        // console.log('data: ', element.payload.doc.data())
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log("Info Empleado: ", this.empleados);
    })
  }

  eliminarEmpleado(id: string){
    this._empleadoService.eliminarEmpleado(id)
    .then(() => {
      console.log("Empleado eliminado con exito");
      this.toastr.error('Empleado eliminado con exito', 'EMPLEADO ELIMINADO', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error =>{
      console.log("Error: ", error);
    });
  }

}
