import Image from "next/image";

export default function Post({ path }) {
  return <Image src={path} />;
}
