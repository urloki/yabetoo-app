import ApiKey from "@/src/features/developer/api-key";

export default function Dashboard() {
  return (
    <main className="mt-10 flex flex-col">
      <div className="flex items-center justify-between space-y-2 pb-10">
        <div>
          <p className="text-muted-foreground">
            Here&apos;s all the tools you need to integrate with our API!
          </p>
        </div>
        <div className="flex items-center space-x-2" />
      </div>
      <ApiKey />
    </main>
  );
}
