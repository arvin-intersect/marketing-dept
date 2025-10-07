import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Intersect AI</h1>
        <p className="text-muted-foreground">Sign in to access your marketing dashboard</p>
      </div>
      <SignIn path="/login" routing="path" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
    </div>
  );
};

export default LoginPage;