import Loader from "./loader";

export const metadata = {
  title: "Identidade",
};

export default async function PersonagemByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <Loader id={id} />
    </div>
  );
}
