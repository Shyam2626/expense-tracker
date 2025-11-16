import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, Eye, Copy, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SecureVault
            </span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Content */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your Passwords,{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Perfectly Secure
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Store, manage, and access all your passwords in one encrypted vault.
              Zero-knowledge architecture means only you can decrypt your data.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">End-to-End Encryption</h3>
              <p className="text-muted-foreground">
                Military-grade AES-256 encryption ensures your passwords are always protected.
              </p>
            </div>

            <div className="rounded-2xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <Key className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Zero-Knowledge</h3>
              <p className="text-muted-foreground">
                We never see your passwords. Only you have the encryption keys.
              </p>
            </div>

            <div className="rounded-2xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Access</h3>
              <p className="text-muted-foreground">
                Access your passwords anywhere, anytime with our secure cloud sync.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-primary to-secondary p-12 text-primary-foreground shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to secure your digital life?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of users who trust SecureVault with their passwords.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Create Your Vault
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SecureVault. Your passwords, your control.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
