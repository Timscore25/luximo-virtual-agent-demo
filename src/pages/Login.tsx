
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { login, user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      // Error handling is now done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-luximo-600 hover:text-luximo-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Назад към начална страница</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Вход</CardTitle>
            <CardDescription className="text-center">
              Въведете вашите данни за достъп до системата
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Имейлът е задължителен",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Невалиден имейл адрес"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имейл</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="имейл@пример.бг" 
                          type="email" 
                          {...field}
                          autoComplete="email"
                          disabled={isFormLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Паролата е задължителна",
                    minLength: {
                      value: 6,
                      message: "Паролата трябва да е поне 6 символа"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Парола</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          {...field} 
                          autoComplete="current-password"
                          disabled={isFormLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-luximo-600 hover:bg-luximo-700"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Зареждане</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </span>
                  ) : (
                    "Вход"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Използвайте вашия Supabase акаунт за вход
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
