import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  authForm!: FormGroup;
  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {
    this.createForm();
  }

  createForm() {
    if (this.isRegister) {
      this.authForm = this.fb.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      });
    } else {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  }

  toggleAuthMode() {
    this.isRegister = !this.isRegister;
    this.createForm();
  }

  submit() {
    if (this.authForm && this.authForm.valid) {
      const { email, senha, nome, telefone } = this.authForm.value;
      
      if (this.isRegister) {
        console.log('Formulário de registro', { nome, email, senha, telefone });
        this.usuarioService.cadastrarCliente(nome, email, senha, telefone).subscribe({
          next: (response) => {
            console.log('Cadastro feito');
            this.authService.login(email, senha).subscribe({
              next: (response) => {
                console.log('Login bem-sucedido:', response);
                localStorage.setItem('token', response.token);
                localStorage.setItem('id', response.usuario.id);
                this.navCtrl.navigateRoot('/home');
              },
              error: (err) => {
                console.error('Erro no login:', err);
                alert(err.error.message || 'Erro ao fazer login');
              },
            });
          },
          error: (err) => {
            console.error('Erro no cadastro:', err);
            alert(err.error.message || 'Erro ao cadastrar');
          },
        });
      } else {
        this.authService.login(email, senha).subscribe({
          next: (response) => {
            console.log('Login bem-sucedido:', response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('id', response.usuario.id);
            this.navCtrl.navigateRoot('/home');
          },
          error: (err) => {
            console.error('Erro no login:', err);
            alert(err.error.message || 'Erro ao fazer login');
          },
        });
      }
    } else {
      console.log('Formulário inválido');
    }
  }
}
