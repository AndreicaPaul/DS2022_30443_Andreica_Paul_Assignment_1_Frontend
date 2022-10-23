export const translations = {
  auth: {
    welcomeText: $localize`:@@auth.welcomeText:Welcome!`,
    register: {
      title: $localize`:@@auth.register.title:Register`,
      welcomeText: $localize`:@@auth.register.welcomeText:Let's get to know you!`
    },
    login: {
      title: $localize`:@@auth.login.title:Login`,
      welcomeBack: $localize`:@@auth.login.welcomeBack:Welcome back!`,
      forgotPassword: $localize`:@@auth.login.forgotPassword:Forgot Password?`
    },
    forgotPassword: {
      title: $localize`:@@auth.forgotPassword.title:Forgot Password`,
      emailSent: $localize`:@@auth.forgotPassword.emailSent:E-mail sent`,
      rememberedText: $localize`:@@auth.forgotPassword.rememberedText:Remembered?`
    },
    resetPassword: {
      title: $localize`:@@auth.resetPassword.title:Reset Password`
    }
  },
  labels: {
    email: $localize`:@@labels.email:E-mail`,
    emailNotReceived: $localize`:@@labels.emailNotReceived: Didn't get it?`,
    password: $localize`:@@labels.password:Password`,
    newPassword: $localize`:@@labels.newPassword:New Password`,
    confirmPassword: $localize`:@@labels.confirmPassword:Confirm Password`,
    firstName: $localize`:@@labels.firstName:First Name`,
    lastName: $localize`:@@labels.lastName:Last Name`,
    gender: $localize`:@@labels.gender:Gender`,
    male: $localize`:@@labels.male:Male`,
    female: $localize`:@@labels.female:Female`,
    other: $localize`:@@labels.other:Other`,
    submit: $localize`:@@labels.submit:Submit`,
    resend: $localize`:@@labels.resend:Resend`,
    resetPassword: $localize`:@@labels.resetPassword:Reset Password`,
    backTo: $localize`:@@labels.backTo:Back to`,
    returnTo: $localize`:@@labels.returnTo:Return to`,
    clear: $localize`:@@labels.clear:Clear`,
    noItems: $localize`:@@labels.noItems:No Items`
  },
  errors: {
    email: $localize`:@@errors.email:Invalid email address`,
    matchingPassword: $localize`:@@errors.matchingPassword:Passwords don't match`,
    required: $localize`:@@errors.required:This field is required`
  }
};
