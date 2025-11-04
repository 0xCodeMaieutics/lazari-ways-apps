import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center space-y-6 px-4 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold tracking-tight">
            Service Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            The service you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <Button
          size={"lg"}
          asChild
          value={"link"}
          className="flex items-center gap-2 h-12 text-xl font-semibold"
        >
          <Link href="/" className="max-w-max mx-auto">
            <ArrowLeft />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
