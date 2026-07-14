import Image from "next/image";

export default function Background() {
    return (
        <>
        <Image
            src="/background/x-lines.svg"
            alt=""
            fill
            className="absolute top-0 left-0 object-cover -z-10 pointer-events-none"
            priority
        />
        <Image
            src="/background/y-lines.svg"
            alt=""
            fill
            className="absolute top-0 left-0 object-cover -z-10 pointer-events-none"
        />
        </>
    );
}