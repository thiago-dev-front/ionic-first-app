import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from 'src/app/core/services/auth.types';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Login',
    actionChange: 'Create account',
  };

  private nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  // Alternância de método na página
  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Login' : 'Sign Up';
    this.configs.actionChange = isSignIn
      ? 'Create account'
      : 'Already have an account';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isSignIn
      ? this.authForm.addControl('name', this.nameControl)
      : this.authForm.removeControl('name');
  }

  private createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get name(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return <FormControl>this.authForm.get('name');
  }

  get email(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return <FormControl>this.authForm.get('email');
  }

  get password(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return <FormControl>this.authForm.get('password');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async onSubmit(provider: AuthProvider): Promise<void> {
    const loading = await this.overlayService.loading();
    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider,
      });
      this.navCtrl.navigateForward(
        this.route.snapshot.queryParamMap.get('redirect') || '/tasks'
      );
    } catch (e) {
      console.log('Auth error... ', e);
      await this.overlayService.toast({
        message: e.message,
      });
    } finally {
      loading.dismiss();
    }
  }
}
