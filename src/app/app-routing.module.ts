import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TensorComponent } from './tensor/tensor.component';
import { MagentaComponent } from './magenta/magenta.component';

const routes: Routes = [
  {
    path: 'tensor',
    component: TensorComponent
  },
  {
    path: 'magenta',
    component: MagentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
