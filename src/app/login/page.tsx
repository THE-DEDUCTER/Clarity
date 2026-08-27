"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The experience is seamless and the features are exactly what I needed for my wellness journey.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I manage my mental health. Clean design, powerful features, and excellent support.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but Clarity stands out. Intuitive, reliable, and genuinely helpful for my productivity.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to Clarity.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Coming soon",
      description: "Google sign-in will be available shortly.",
    });
  };

  const handleResetPassword = () => {
    router.push("/register");
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        title={
          <>
            Welcome back to{" "}
            <span className="text-violet-500">Clarity</span>
          </>
        }
        description="Sign in to continue your mental wellness journey — we've missed you."
        heroImageSrc="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=2160&q=80"
        testimonials={testimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}
