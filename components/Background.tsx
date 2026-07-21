import Image from "next/image";

export default function Background() {
    return (
    <div className="fixed inset-0 -z-10">
    <Image
        src="/background/x-lines.svg"
        alt=""
        fill
        className="object-cover pointer-events-none"
        priority
    />
    <Image
        src="/background/y-lines.svg"
        alt=""
        fill
        className="object-cover pointer-events-none"
    />
    </div>
    );
}