import moment from "moment";

export const ChatGreeting = () => {
  const greeting = () => {
    const date = moment();
    const hours = date.get("hour");
    if (hours < 12) return `Good Morning,`;
    if (hours < 18) return `Good Afternoon,`;
    return `Good Evening,`;
  };

  return (
    <div className="flex flex-col items-start gap-2 mb-2 ml-1">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
        <span className="text-zinc-500 dark:text-zinc-400">{greeting()}</span>
        <br />
        How can I help you today? 😊
      </h1>
    </div>
  );
};
