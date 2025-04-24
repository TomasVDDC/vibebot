import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getBotsInfo } from "@/app/actions/actions";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const bots = await getBotsInfo();
  return (
    <div className="flex flex-col w-full p-4 gap-4">
      {bots.length === 0 ? (
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>No Bots Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You haven't created any bots yet.</p>
          </CardContent>
        </Card>
      ) : (
        bots.map((bot) => (
          <Card key={bot.id} className="w-full max-w-[400px]">
            <CardHeader className="gap-0">
              <CardTitle className="text-xl ">{bot.first_name}</CardTitle>
              <CardDescription className="text-sm text-gray-500">@{bot.username}</CardDescription>
            </CardHeader>
            {/* <CardContent></CardContent> */}
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" variant="default">
                <a href={`https://t.me/${bot.username}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Telegram
                </a>
              </Button>
              <Link href={`/home/${bot.id}`} className="w-full">
                <Button variant="neutral" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Edit Bot
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
