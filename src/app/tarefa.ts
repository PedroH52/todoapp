export class Tarefa {
    _id?: string;
    descricao: string;
    statusRealizada: boolean;

    constructor(_descricao: string, _statusRealizada: boolean, _id?: string) {
      this.descricao = _descricao;
      this.statusRealizada = _statusRealizada;
      this._id = _id;
    }
  }