import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import TableComponent from './components/Table'
import { Button } from 'antd';
import { useState } from 'react';
import { ModalAdd } from './components/ModalAdd';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient();

function App() {
  const [isModalAdd, setIsModalAdd] = useState(false);

const handleIsOpenAdd = () => {
  setIsModalAdd(true);
};
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center min-h-screen gap-2 w-full py-10" >
      <h1 className=" text-3xl font-bold text-center">Employee Management</h1>

        <ModalAdd isModalAdd={isModalAdd} setIsModalAdd={setIsModalAdd} />
          <Button
          type="primary"
          onClick={handleIsOpenAdd}
        >
          Add Employee
        </Button>
        <TableComponent />
      </div>
               <ReactQueryDevtools initialIsOpen={true} />

    </QueryClientProvider>
  )
}

export default App
