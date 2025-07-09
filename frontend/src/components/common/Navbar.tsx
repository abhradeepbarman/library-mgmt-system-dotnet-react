const Navbar = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-14 border-b border-gray-400 flex items-center pl-10">
      <p className="text-2xl font-semibold">{title}</p>
    </div>
  );
};

export default Navbar;
