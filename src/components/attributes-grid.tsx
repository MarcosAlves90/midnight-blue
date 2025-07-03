import AttributeCard from "./attributes-grid/attribute-card";

const attributes = [
    { name: "Força", abbreviation: "FOR", borderColor: "border-t-red-500" },
    { name: "Destreza", abbreviation: "DES", borderColor: "border-t-yellow-500" },
    { name: "Vigor", abbreviation: "VIG", borderColor: "border-t-green-500" },
    { name: "Inteligência", abbreviation: "INT", borderColor: "border-t-blue-500" },
    { name: "Presença", abbreviation: "PRE", borderColor: "border-t-purple-500" },
];

export default function AttributesGrid() {
    return (
        <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">Atributos</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {attributes.map((attr) => (
                    <AttributeCard
                        key={attr.abbreviation}
                        name={attr.name}
                        abbreviation={attr.abbreviation}
                        borderColor={attr.borderColor}
                    />
                ))}
            </div>
        </div>
    );
}
