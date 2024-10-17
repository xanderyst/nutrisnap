import { NavigationMenu } from "./NavigationMenu";
import LoginButton from "./LoginButton";

export function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">NutriSnap</h1>
          <div className="flex items-center space-x-4">
            <LoginButton />
            <NavigationMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
