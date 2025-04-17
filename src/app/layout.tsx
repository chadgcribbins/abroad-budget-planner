import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '../context/CurrencyContext';
import { IncomeProvider } from '../context/IncomeContext';
import { LifestyleProvider } from '../context/LifestyleContext';
import { TransportProvider } from '../context/TransportContext';
import { EmergencyBufferProvider } from '../context/EmergencyBufferContext';
import { AppBudgetProvider } from '../context/AppBudgetContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Abroad Budget Planner',
  description: 'Plan your budget for living abroad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <CurrencyProvider>
          <AppBudgetProvider>
            <IncomeProvider>
              <LifestyleProvider>
                <TransportProvider>
                  <EmergencyBufferProvider>
                    <div className="drawer">
                      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
                      <div className="drawer-content flex flex-col">
                        {/* Navbar */}
                        <div className="w-full navbar bg-base-300">
                          <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </label>
                          </div> 
                          <div className="flex-1 px-2 mx-2 font-bold text-xl">Abroad Budget Planner</div>
                          <div className="flex-none hidden lg:block">
                            <ul className="menu menu-horizontal">
                              <li><a href="/">Home</a></li>
                              <li><a href="/destinations">Destinations</a></li>
                              <li><a href="/budget">Budget</a></li>
                              <li><a href="/expenses">Expenses</a></li>
                              <li><a href="/compare">Compare</a></li>
                            </ul>
                          </div>
                        </div>
                        {/* Page content here */}
                        <main className="container mx-auto px-4 py-8">
                          {children}
                        </main>
                      </div> 
                      <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label> 
                        <ul className="menu p-4 w-80 min-h-full bg-base-200">
                          <li><a href="/">Home</a></li>
                          <li><a href="/destinations">Destinations</a></li>
                          <li><a href="/budget">Budget</a></li>
                          <li><a href="/expenses">Expenses</a></li>
                          <li><a href="/compare">Compare</a></li>
                        </ul>
                      </div>
                    </div>
                  </EmergencyBufferProvider>
                </TransportProvider>
              </LifestyleProvider>
            </IncomeProvider>
          </AppBudgetProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
