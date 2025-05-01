import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Bell, Languages } from "lucide-react";

export default function BotExamples() {
  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mb-2">
              <Cloud className="w-5 h-5 text-sky-600" />
            </div>
            <CardTitle className="text-xl">Weather Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              A bot that provides weather forecasts for any location. Users can ask for current conditions or multi-day forecasts.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Example commands:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li className="text-muted-foreground">/weather New York</li>
                <li className="text-muted-foreground">/forecast London 5 days</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-2">
              <Bell className="w-5 h-5 text-violet-600" />
            </div>
            <CardTitle className="text-xl">Reminder Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              A bot that helps users set and manage reminders. Perfect for keeping track of tasks and appointments.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Example commands:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li className="text-muted-foreground">/remind Call mom tomorrow at 5pm</li>
                <li className="text-muted-foreground">/list all reminders</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <Languages className="w-5 h-5 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Translation Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              A bot that translates text between different languages. Supports multiple language pairs and detects input language.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Example commands:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li className="text-muted-foreground">/translate Hello to Spanish</li>
                <li className="text-muted-foreground">/detect This is some text</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
