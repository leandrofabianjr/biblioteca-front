import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewRef,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info-erro-campo',
  templateUrl: './info-erro-campo.component.html',
  styleUrls: ['./info-erro-campo.component.scss'],
})
export class InfoErroCampoComponent implements OnInit, OnDestroy {
  /**
   * Controle do componente do formulário a ser verificado
   */
  @Input() control!: AbstractControl;

  @Input() container = true;

  @Output() temErro = new EventEmitter<any>();

  /**
   * Mensagens padrão de erro na validação de campos de formulário
   */
  private mensErroPadrao: any = {
    // Validação de obrigatoriedade
    required: (e: any) => 'Essa informação é obrigatória',

    // Validações de limites de string
    minlength: (e: any) =>
      `A informação deve conter no mínimo ${e.requiredLength} caracteres`,
    maxlength: (e: any) =>
      `A informação deve conter até ${e.requiredLength} caracteres`,

    // Validações de limites numéricos
    min: (e: any) => `O valor mínimo é ${e.min}`,
    max: (e: any) => `O valor máximo é ${e.max}`,

    // Validação de email
    email: (e: any) => 'O email informado não é válido',
  };

  /**
   * Mensagem sendo mostrada no componente
   */
  public mensagem?: string;

  /**
   * Assinatura de mudanças de status do controle do campo do formulário
   */
  private subsStatusChangeControl!: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Observa as mudanças de status do controle do campo do formulário
    this.subsStatusChangeControl = this.control.statusChanges.subscribe(
      (status) => {
        this.mensagem = undefined;

        if (status === 'INVALID') {
          // Se o campo estiver inválido

          // Procura o primeiro erro no componente e,
          // se houver mensagem cadastrada para ele, mostra a mensagem
          Object.keys(this.control.errors || {}).some((erro) => {
            this.mensagem = this.getMensagem(erro);
            return !!this.mensagem;
          });
        }

        // Atualiza a visualização do componente
        this.updateView();

        this.temErro.emit();
      }
    );
  }

  /**
   * Procura e retorna a mensagem referente ao erro especificado
   */
  getMensagem(erro: any): string {
    const msg = this.control?.errors ? this.control?.errors[erro] : 'Erro';
    return this.mensErroPadrao[erro] ? this.mensErroPadrao[erro](msg) : null;
  }

  /**
   * Atualização necessária para evitar o erro:
   * ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
   */
  private updateView() {
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    // Desassina observador de mudanças de status do controle do campo do formulário
    this.subsStatusChangeControl.unsubscribe();
  }
}
