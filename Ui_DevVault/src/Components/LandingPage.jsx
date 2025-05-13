"use client"
import React, { useState } from "react"
import { Button } from "./Ui/Button.jsx"
import { Input } from "./Ui/Input.jsx"
import { Label } from "./Ui/Label.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Ui/Card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Ui/Tabs.jsx"
export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 relative mr-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2L12 4" />
            <path d="M12 20L12 22" />
            <path d="M2 12L4 12" />
            <path d="M20 12L22 12" />
            <path d="M4.93 4.93L6.34 6.34" />
            <path d="M17.66 17.66L19.07 19.07" />
            <path d="M4.93 19.07L6.34 17.66" />
            <path d="M17.66 6.34L19.07 4.93" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white">DevVault</h1>
      </div>

      <div className="max-w-md w-full">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-gray-800 bg-gray-900 text-white">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to access your snippets
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required className="bg-gray-800 border-gray-700" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-gray-800 bg-gray-900 text-white">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription className="text-gray-400">Enter your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" required className="bg-gray-800 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="example@email.com"
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" required className="bg-gray-800 border-gray-700" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
