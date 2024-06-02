interface IllustraionProps {
  src: string;
  title: string;
  message: string;
}

const Illustration: React.FC<IllustraionProps> = ({ src, title, message }) => {
  return (
    <>
      <img className="block w-64" src={src} alt="" />
      <p className="mt-6 mb-4 text-black font-semibold">{title}</p>
      <p className="text-center leading-1.5">{message}</p>
    </>
  )
}

export default Illustration;
