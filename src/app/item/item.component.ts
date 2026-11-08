import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarefa } from "../tarefa";

@Component({
  selector: 'app-item',
  standalone: false,
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  emEdicao = false;

  @Input()
  tarefa: Tarefa = new Tarefa("", false);

  @Output()
  removerTarefa = new EventEmitter<Tarefa>();

  @Output()
  atualizarTarefa = new EventEmitter<{ tarefa: Tarefa, novaDescricao: string }>();

  @Output()
  toggleTarefa = new EventEmitter<Tarefa>();

  salvarEdicao(novaDescricao: string) {
    this.atualizarTarefa.emit({ tarefa: this.tarefa, novaDescricao });
    this.emEdicao = false;
  }

  toggleStatus() {
    this.toggleTarefa.emit(this.tarefa);
  }
}
