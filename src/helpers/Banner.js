export const Banner = ({ title, message, Icon }) => {
  return (
    <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 flex flex-row items-center space-x-4">
      <Icon />
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
