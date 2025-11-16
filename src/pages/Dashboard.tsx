import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Search, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { PasswordCard } from "@/components/PasswordCard";
import { AddPasswordDialog } from "@/components/AddPasswordDialog";

// Mock data - will be replaced with real database data
const mockPasswords = [
  {
    id: "1",
    title: "GitHub",
    username: "user@example.com",
    password: "••••••••••••",
    category: "Development",
    url: "https://github.com",
  },
  {
    id: "2",
    title: "Gmail",
    username: "user@gmail.com",
    password: "••••••••••••",
    category: "Email",
    url: "https://gmail.com",
  },
  {
    id: "3",
    title: "AWS Console",
    username: "admin",
    password: "••••••••••••",
    category: "Cloud",
    url: "https://aws.amazon.com",
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPasswords = mockPasswords.filter((password) =>
    password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    password.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SecureVault
              </span>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Top Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Vault</h1>
            <p className="text-muted-foreground">
              {mockPasswords.length} passwords stored securely
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 rounded-full shadow-lg">
            <Plus className="h-4 w-4" />
            Add Password
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </div>

        {/* Password Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPasswords.map((password) => (
            <PasswordCard key={password.id} {...password} />
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No passwords found</p>
          </div>
        )}
      </main>

      <AddPasswordDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
