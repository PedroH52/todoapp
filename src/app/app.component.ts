import { Component, OnInit, signal } from '@angular/core';
import { Tarefa } from './tarefa';
import { TarefaService } from './tarefa.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  protected readonly title = signal('TODOapp');

  arrayDeTarefas: Tarefa[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(private tarefaService: TarefaService) {}

  ngOnInit() {
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    if (!descricaoNovaTarefa.trim()) return;

    this.tarefaService.create(descricaoNovaTarefa).subscribe({
      next: (novaTarefa) => {
        this.arrayDeTarefas.unshift(novaTarefa);
      },
      error: (err) => {
        console.error('Erro ao criar tarefa:', err);
        this.erro = 'Não foi possível adicionar a tarefa.';
      }
    });
  }

  DELETE_tarefa(tarefaParaRemover: Tarefa) {
    if (!tarefaParaRemover._id) return;

    // Atualização otimista: remove da UI imediatamente
    this.arrayDeTarefas = this.arrayDeTarefas.filter(
      t => t._id !== tarefaParaRemover._id
    );

    this.tarefaService.delete(tarefaParaRemover._id).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Erro ao remover tarefa:', err);
        this.erro = 'Não foi possível remover a tarefa.';
        // Restaura o item se falhar
        this.arrayDeTarefas = [...this.arrayDeTarefas, tarefaParaRemover];
      }
    });
  }

  UPDATE_tarefa(tarefa: Tarefa, novaDescricao: string) {
    if (!tarefa._id) return;

    this.tarefaService.update(tarefa._id, { descricao: novaDescricao }).subscribe({
      next: (tarefaAtualizada) => {
        this.arrayDeTarefas = this.arrayDeTarefas.map(t =>
          t._id === tarefa._id ? tarefaAtualizada : t
        );
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        this.erro = 'Não foi possível atualizar a tarefa.';
      }
    });
  }

  TOGGLE_tarefa(tarefa: Tarefa) {
    if (!tarefa._id) return;

    this.tarefaService.update(tarefa._id, { statusRealizada: !tarefa.statusRealizada }).subscribe({
      next: (tarefaAtualizada) => {
        const index = this.arrayDeTarefas.findIndex(t => t._id === tarefa._id);
        if (index !== -1) {
          this.arrayDeTarefas[index].statusRealizada = tarefaAtualizada.statusRealizada;
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
      }
    });
  }

  READ_tarefas() {
    this.carregando = true;
    this.erro = null;
    this.tarefaService.getAll().pipe(
      retry({ count: 3, delay: 5000 })
    ).subscribe({
      next: (tarefas) => {
        this.arrayDeTarefas = tarefas;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.erro = 'Não foi possível conectar à API. Tente recarregar a página.';
        this.carregando = false;
      }
    });
  }
}
